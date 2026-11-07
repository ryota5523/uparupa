# 管理画面APIをWorkerに追加する

対象Worker: `manami-site-worker`

## 1. Secretを登録

Cloudflare Dashboard → Workers & Pages → manami-site-worker → Settings → Variables and Secrets → Add → Secret

- Variable name: `ADMIN_TOKEN`
- Value: 自分だけが知っている長くランダムな文字列（32文字以上推奨）

保存後、Workerをデプロイする。

## 2. CORSヘッダーを変更

既存の `corsHeaders` の `Access-Control-Allow-Headers` を次に変更する。

```js
"Access-Control-Allow-Headers": "Content-Type, Authorization",
```

## 3. 認証チェックを追加

`fetch(request, env)` の中で、OPTIONS処理の直後、`if (!env.DB)` より前に追加する。

```js
if (url.pathname.startsWith("/api/admin/")) {
  const expected = env.ADMIN_TOKEN;
  const authorization = request.headers.get("Authorization") || "";
  if (!expected) {
    return json({ ok: false, error: "ADMIN_TOKEN secret is not configured" }, 503);
  }
  if (authorization !== `Bearer ${expected}`) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }
}
```

## 4. 管理APIを追加

既存の `try {` の直後、最初のR2写真ルートより前に追加する。

```js
// -------------------------------------
// 管理API（ADMIN_TOKEN認証必須）
// -------------------------------------
if (url.pathname === "/api/admin/schedules") {
  if (request.method === "GET") {
    const result = await env.DB.prepare(`
      SELECT id, title, event_date, venue, category, url,
        CASE
          WHEN category IN ('ミーグリ', 'meet') THEN 'meet'
          WHEN category IN ('その他', 'other') THEN 'other'
          ELSE 'appearance'
        END AS kind
      FROM schedules
      ORDER BY event_date ASC, id DESC
    `).all();
    return json({ ok: true, items: result.results });
  }

  if (request.method === "POST") {
    const body = await request.json();
    const eventDate = String(body.event_date || "");
    const title = String(body.title || "").trim();
    const kind = ["appearance", "meet", "other"].includes(body.kind)
      ? body.kind : "appearance";
    const category = kind === "meet" ? "ミーグリ"
      : kind === "other" ? "その他" : "出演情報";
    const link = body.url ? String(body.url).trim() : null;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || !title) {
      return json({ ok: false, error: "開催日とタイトルを入力してください" }, 400);
    }
    if (link && !/^https:\/\//i.test(link)) {
      return json({ ok: false, error: "URLはhttps://から入力してください" }, 400);
    }

    const result = await env.DB.prepare(`
      INSERT INTO schedules (title, event_date, venue, category, url, created_at)
      VALUES (?, ?, '', ?, ?, CURRENT_TIMESTAMP)
    `).bind(title, eventDate, category, link).run();

    return json({ ok: true, id: result.meta?.last_row_id ?? null });
  }
}

const adminScheduleMatch = url.pathname.match(/^\/api\/admin\/schedules\/(\d+)$/);
if (adminScheduleMatch) {
  const id = Number(adminScheduleMatch[1]);

  if (request.method === "PUT") {
    const body = await request.json();
    const eventDate = String(body.event_date || "");
    const title = String(body.title || "").trim();
    const kind = ["appearance", "meet", "other"].includes(body.kind)
      ? body.kind : "appearance";
    const category = kind === "meet" ? "ミーグリ"
      : kind === "other" ? "その他" : "出演情報";
    const link = body.url ? String(body.url).trim() : null;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || !title) {
      return json({ ok: false, error: "開催日とタイトルを入力してください" }, 400);
    }
    if (link && !/^https:\/\//i.test(link)) {
      return json({ ok: false, error: "URLはhttps://から入力してください" }, 400);
    }

    const result = await env.DB.prepare(`
      UPDATE schedules
      SET title = ?, event_date = ?, category = ?, url = ?
      WHERE id = ?
    `).bind(title, eventDate, category, link, id).run();

    if (!result.meta?.changes) {
      return json({ ok: false, error: "予定が見つかりません" }, 404);
    }
    return json({ ok: true });
  }

  if (request.method === "DELETE") {
    const result = await env.DB.prepare(
      "DELETE FROM schedules WHERE id = ?"
    ).bind(id).run();

    if (!result.meta?.changes) {
      return json({ ok: false, error: "予定が見つかりません" }, 404);
    }
    return json({ ok: true });
  }
}

if (url.pathname === "/api/admin/site-info") {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS site_info (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      tagline TEXT NOT NULL DEFAULT '',
      intro TEXT NOT NULL DEFAULT '',
      note_title TEXT NOT NULL DEFAULT '',
      note_body TEXT NOT NULL DEFAULT '',
      updated_at TEXT
    )
  `).run();

  if (request.method === "GET") {
    const item = await env.DB.prepare(
      "SELECT tagline, intro, note_title, note_body, updated_at FROM site_info WHERE id = 1"
    ).first();
    return json({ ok: true, item: item || {} });
  }

  if (request.method === "PUT") {
    const body = await request.json();
    const values = [
      String(body.tagline || "").slice(0, 120),
      String(body.intro || "").slice(0, 500),
      String(body.note_title || "").slice(0, 80),
      String(body.note_body || "").slice(0, 200)
    ];

    await env.DB.prepare(`
      INSERT INTO site_info (id, tagline, intro, note_title, note_body, updated_at)
      VALUES (1, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        tagline = excluded.tagline,
        intro = excluded.intro,
        note_title = excluded.note_title,
        note_body = excluded.note_body,
        updated_at = CURRENT_TIMESTAMP
    `).bind(...values).run();

    return json({ ok: true });
  }
}
```

## 5. 動作確認

管理画面: https://uparu-pa.vercel.app/admin.html

トークン入力後、予定の追加・編集・削除とサイト情報の保存を確認する。

この管理APIはWorker側で必ずトークン認証する。管理画面のURLを知っているだけでは変更できない。Cloudflare Accessを `/admin.html` に設定している場合は、その保護も維持すること。

サイト情報はD1に保存される段階までの実装。トップページの表示に反映させるには、別途トップページ側から `/api/site-info` を読み込む連携が必要。
