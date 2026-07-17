UPDATE users SET role = 'ADMIN' WHERE id = (SELECT id FROM users ORDER BY "createdAt" ASC LIMIT 1);
