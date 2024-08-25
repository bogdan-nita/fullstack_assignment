import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { MultiBar, Presets } from 'cli-progress';

const prisma = new PrismaClient();
const NUMBER_OF_USERS = 10;
const MIN_NUMBER_OF_INVOICES = 10;
const MAX_NUMBER_OF_INVOICES = 20;

async function main() {
  const credentials = [];
  const multibar = new MultiBar(
    {
      format: '{name} ({value}/{total}) |{bar}| {percentage}%',
      clearOnComplete: false,
      hideCursor: true,
    },
    Presets.shades_classic,
  );

  const userProgressBar = multibar.create(NUMBER_OF_USERS, 0, {
    name: 'User Seeding',
  });

  let totalInvoices = 0;
  const invoiceProgressBar = multibar.create(1, 0, {
    name: 'Invoice Seeding',
  });

  console.log('Starting the seeding process...');

  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName,
      lastName,
    });
    const password = faker.internet.password();

    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        password: await bcrypt.hash(password, 10),
      },
    });

    credentials.push({ email, password });

    const numberOfInvoices = faker.number.int({
      min: MIN_NUMBER_OF_INVOICES,
      max: MAX_NUMBER_OF_INVOICES,
    });

    totalInvoices += numberOfInvoices;
    invoiceProgressBar.setTotal(totalInvoices);

    for (let j = 0; j < numberOfInvoices; j++) {
      const days = faker.number.int({ min: 1, max: 60 });
      const isFuture = faker.datatype.boolean();
      const dueDate = isFuture ? faker.date.soon({ days }) : faker.date.past();

      await prisma.invoice.create({
        data: {
          vendor_name: faker.company.name(),
          amount: parseFloat(
            faker.commerce.price({ min: 100, max: 1000, dec: 2 }),
          ),
          due_date: dueDate,
          description: faker.lorem.sentence(),
          user_id: user.id,
          paid: faker.datatype.boolean(),
        },
      });

      // Update invoice progress for each invoice created
      invoiceProgressBar.increment();
    }

    // Update user progress after finishing invoices for that user
    userProgressBar.increment();
  }

  multibar.stop();

  const filePath = path.join(__dirname, 'credentials.json');

  if (fs.existsSync(filePath)) {
    const existingData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(existingData);

    const updatedData = [...parsedData, ...credentials];
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
  } else {
    fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
  }

  console.log('Database seeded with users and invoices!');
  console.log(`Credentials saved to ${filePath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
