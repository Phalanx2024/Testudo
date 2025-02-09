import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../../lib/placeholder-data';
import {short_reports, report_statistic, short_sellers, target_companies} from '../../lib/testudo-data';

const client = await db.connect();

async function seedReportStatistic() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS report_statistic (
      year VARCHAR(4) NOT NULL UNIQUE,
      number INT NOT NULL
    );
  `;

  const insertedShortRevenue = await Promise.all(
    report_statistic.map(
      (rev) => client.sql`
        INSERT INTO report_statistic (year, number)
        VALUES (${rev.year}, ${rev.number})
        ON CONFLICT (year) DO NOTHING; 
      `,
    ),
  );

  return insertedShortRevenue;
}

async function seedShortSeller() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS short_sellers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      link TEXT DEFAULT NULL
    );
  `;

  const insertShortSelller = await Promise.all(
    short_sellers.map(
      (short_seller) => client.sql`
        INSERT INTO short_sellers (name, link)
        VALUES (${short_seller.name},${short_seller.link})
        ON CONFLICT DO NOTHING;
      `,
    ),
  );

  return insertShortSelller;
}


async function seedTargetCompany() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS target_companies (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  const insertTargetCompany= await Promise.all(
    target_companies.map(
      (target_company) => client.sql`
        INSERT INTO target_companies(name)
        VALUES (${target_company.target_company})
        ON CONFLICT DO NOTHING;
      `,
    ),
  );

  return insertTargetCompany;
}

async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // await client.sql`
  //   CREATE TABLE IF NOT EXISTS short_reports (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     publication_date DATE DEFAULT NULL,
  //     report_title TEXT NOT NULL UNIQUE,
  //     short_seller VARCHAR(255) NOT NULL,
  //     link TEXT DEFAULT NULL,
  //     target_company VARCHAR(255) DEFAULT NULL,
  //     ticker VARCHAR(255) DEFAULT NULL,
  //     sector VARCHAR(255) DEFAULT NULL,
  //     last_update  DATE DEFAULT NULL,
  //   );
  // `;

  // const insertedInvoices = await Promise.all(
  //   short_reports.map(
  //     (short_report) => client.sql`
  //       INSERT INTO short_reports (publication_date, report_title, short_seller, last_update, link, target_company, ticker, sector)
  //       VALUES (${short_report.publication_date},${short_report.report_title}, ${short_report.short_seller}, ${short_report.last_update},
  //       ${short_report.link}, ${short_report.target_company},${short_report.ticker}, ${short_report.sector})
  //       ON CONFLICT DO NOTHING;
  //     `,
  //   ),
  // );

  // return insertedInvoices;
}
async function updateReports() {

  const updateReports = await Promise.all(
    short_reports.map(
      (short_report) => client.sql`
        UPDATE short_reports
        SET publication_date = ${short_report.publication_date}
        WHERE report_title = ${short_report.report_title}
      `,
    ),
  );

  return updateReports;
}
// async function seedShortReport(){
//   await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//   await client.sql`
//     CREATE TABLE IF NOT EXISTS short_reports (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       publication_date DATE,
//       report_title TEXT NOT NULL UNIQUE,
//       link TEXT,
//       target_company VARCHAR(255),
//       ticker VARCHAR(255),
//       sector VARCHAR(255),
//       last_update: DATE,
//       short_seller: TEXT NOT NULL
//     );
//   `;

//   const insertedUsers = await Promise.all(
//     short_reports.map(async (short_report) => {
//       return client.sql`
//         INSERT INTO short_reports ( publication_date, report_title, link, target_company, ticker, sector, last_update, short_seller)
//         VALUES ( ${short_report.publication_date}, ${short_report.report_title}, ${short_report.link}, 
//         ${short_report.target_company}, ${short_report.ticker}, ${short_report.sector}, ${short_report.last_update}, ${short_report.short_seller})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     }),
//   );
//   return insertedUsers;
// }

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

// async function seedInvoices() {
//   await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//   await client.sql`
//     CREATE TABLE IF NOT EXISTS invoices (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       customer_id UUID NOT NULL,
//       amount INT NOT NULL,
//       status VARCHAR(255) NOT NULL,
//       date DATE NOT NULL
//     );
//   `;

//   const insertedInvoices = await Promise.all(
//     invoices.map(
//       (invoice) => client.sql`
//         INSERT INTO invoices (customer_id, amount, status, date)
//         VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
//         ON CONFLICT (id) DO NOTHING;
//       `,
//     ),
//   );

//   return insertedInvoices;
// }

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    // await seedShortReport();
    // await seedUsers();
    // await seedCustomers();
    await seedTargetCompany();
    // await seedRevenue();
    // await seedReportStatistic();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
