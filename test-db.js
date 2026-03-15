// test-db.js
const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	console.error("环境变量 DATABASE_URL 未设置");
	process.exit(1);
}

const client = new Client({
	connectionString,
	// Supabase 需要 SSL，且一般用自签证书，所以关闭严格校验证书
	ssl: { rejectUnauthorized: false },
});

async function main() {
	try {
		console.log("正在连接数据库...");
		await client.connect();
		const res = await client.query("SELECT now() AS now");
		console.log("连接成功，数据库时间：", res.rows[0].now);
	} catch (error) {
		console.error("连接失败：", error);
	} finally {
		await client.end();
	}
}

main();
