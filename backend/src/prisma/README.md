# Prisma db pull log

Since we're interacting with the existing database system, we have generated the prisma schema from it.

Here are some logs which might be use ful in future:

```bash
$ yarn prisma db pull

Prisma schema loaded from schema.prisma
Environment variables loaded from ../../.env
Datasource "db": MySQL database "business_intelligence_development" at "localhost:3306"

✔ Introspected 102 models and wrote them into schema.prisma in 187ms

*** WARNING ***

The following models were ignored as they do not have a valid unique identifier or id. This is currently not supported by Prisma Client:
  - "components_work_logs"
  - "employees_work_statements"
  - "fix_versions_work_statements"
```
