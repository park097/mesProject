-- Automotive MES seed data (MySQL 8+)
-- Usage:
-- mysql -u root -p mini_mes < docs/sql/seed_automotive_mes.sql

SET NAMES utf8mb4;
START TRANSACTION;

-- 1) users (for FK: created_by)
INSERT INTO users (username, password, password_hash, role, created_at, updated_at)
VALUES
  ('system',  '$2a$10$7EqJtq98hPqEX7fNZaFWoO5aA4Wv8QWfhKGXT5VqC7EIgA6GrCVX.', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5aA4Wv8QWfhKGXT5VqC7EIgA6GrCVX.', 'ADMIN', NOW(), NOW()),
  ('planner', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5aA4Wv8QWfhKGXT5VqC7EIgA6GrCVX.', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5aA4Wv8QWfhKGXT5VqC7EIgA6GrCVX.', 'USER',  NOW(), NOW()),
  ('line1',   '$2a$10$7EqJtq98hPqEX7fNZaFWoO5aA4Wv8QWfhKGXT5VqC7EIgA6GrCVX.', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5aA4Wv8QWfhKGXT5VqC7EIgA6GrCVX.', 'USER',  NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

SET @u_system := (SELECT id FROM users WHERE username = 'system' LIMIT 1);
SET @u_planner := (SELECT id FROM users WHERE username = 'planner' LIMIT 1);
SET @u_line1 := (SELECT id FROM users WHERE username = 'line1' LIMIT 1);

-- 2) clean previous dummy data (re-runnable)
DELETE FROM stock_history WHERE memo LIKE '[AUTO-SEED]%';
DELETE FROM production_orders WHERE order_no LIKE 'PO-26A-%';
DELETE FROM items
WHERE item_code IN (
  'CAR-SEDAN-A', 'CAR-SUV-B',
  'BRKT-FRT-A', 'PIPE-BRAKE-R', 'SHAFT-DRV-F',
  'ENG-20T', 'TRN-8AT', 'BAT-12V', 'TIRE-18',
  'STEEL-SPHC', 'PAINT-BLK', 'BOLT-M10'
);

-- 3) item masters (finished goods + parts + raw materials)
INSERT INTO items (item_code, item_name, unit, safety_stock, active, created_at, updated_at)
VALUES
  ('CAR-SEDAN-A',  'Sedan A Complete Vehicle',           'EA',   15, TRUE, NOW(), NOW()),
  ('CAR-SUV-B',    'SUV B Complete Vehicle',             'EA',   12, TRUE, NOW(), NOW()),
  ('BRKT-FRT-A',   'Front Bracket A',                    'EA',  400, TRUE, NOW(), NOW()),
  ('PIPE-BRAKE-R', 'Rear Brake Pipe',                    'EA',  300, TRUE, NOW(), NOW()),
  ('SHAFT-DRV-F',  'Front Drive Shaft',                  'EA',  180, TRUE, NOW(), NOW()),
  ('ENG-20T',      'Engine 2.0 Turbo',                   'EA',   80, TRUE, NOW(), NOW()),
  ('TRN-8AT',      'Transmission 8AT',                   'EA',   70, TRUE, NOW(), NOW()),
  ('BAT-12V',      '12V Battery Pack',                   'EA',  120, TRUE, NOW(), NOW()),
  ('TIRE-18',      '18 inch Tire',                       'EA',  500, TRUE, NOW(), NOW()),
  ('STEEL-SPHC',   'SPHC Coil Steel',                    'KG', 9000, TRUE, NOW(), NOW()),
  ('PAINT-BLK',    'Black Paint',                        'L',   700, TRUE, NOW(), NOW()),
  ('BOLT-M10',     'Hex Bolt M10',                       'EA', 2500, TRUE, NOW(), NOW());

-- 4) production orders (mix of done / in progress / created)
INSERT INTO production_orders
  (order_no, item_id, planned_qty, produced_qty, status, due_date, created_by, created_at, updated_at)
VALUES
  ('PO-26A-0001', (SELECT id FROM items WHERE item_code = 'BRKT-FRT-A'),   1200, 1200, 'DONE',        '2026-02-12', @u_planner, NOW(), NOW()),
  ('PO-26A-0002', (SELECT id FROM items WHERE item_code = 'PIPE-BRAKE-R'),  900,  640, 'IN_PROGRESS', '2026-03-02', @u_planner, NOW(), NOW()),
  ('PO-26A-0003', (SELECT id FROM items WHERE item_code = 'SHAFT-DRV-F'),   500,  250, 'IN_PROGRESS', '2026-03-04', @u_planner, NOW(), NOW()),
  ('PO-26A-0004', (SELECT id FROM items WHERE item_code = 'CAR-SEDAN-A'),   120,    0, 'CREATED',     '2026-03-15', @u_system,  NOW(), NOW()),
  ('PO-26A-0005', (SELECT id FROM items WHERE item_code = 'CAR-SUV-B'),      90,    0, 'CREATED',     '2026-03-20', @u_system,  NOW(), NOW());

-- 5) inventory transactions with LOT / PROCESS / SHIFT memo pattern
INSERT INTO stock_history (item_id, type, quantity, memo, created_by, created_at, updated_at)
VALUES
  ((SELECT id FROM items WHERE item_code = 'STEEL-SPHC'),   'IN', 24000, '[AUTO-SEED] LOT:STL-2602-01 / PROC:RCV / SHIFT:A / coil steel inbound', @u_system,  NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'PAINT-BLK'),    'IN',  1800, '[AUTO-SEED] LOT:PNT-2602-03 / PROC:RCV / SHIFT:A / paint inbound',      @u_system,  NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'BOLT-M10'),     'IN',  9000, '[AUTO-SEED] LOT:BLT-2602-11 / PROC:RCV / SHIFT:B / fastener inbound',   @u_system,  NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'ENG-20T'),      'IN',   300, '[AUTO-SEED] LOT:ENG-2602-02 / PROC:AS01 / SHIFT:B / engine inbound',    @u_system,  NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'TRN-8AT'),      'IN',   260, '[AUTO-SEED] LOT:TRN-2602-05 / PROC:AS01 / SHIFT:B / transmission in',   @u_system,  NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'BAT-12V'),      'IN',   320, '[AUTO-SEED] LOT:BAT-2602-04 / PROC:AS01 / SHIFT:C / battery inbound',   @u_system,  NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'TIRE-18'),      'IN',  1500, '[AUTO-SEED] LOT:TIR-2602-07 / PROC:AS01 / SHIFT:C / tire inbound',      @u_system,  NOW(), NOW()),

  ((SELECT id FROM items WHERE item_code = 'STEEL-SPHC'),   'OUT',13000, '[AUTO-SEED] LOT:STL-2602-01 / PROC:BE20 / SHIFT:A / blanking consume',  @u_line1,   NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'STEEL-SPHC'),   'OUT', 6200, '[AUTO-SEED] LOT:STL-2602-01 / PROC:AA04 / SHIFT:B / bending consume',   @u_line1,   NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'PAINT-BLK'),    'OUT',  940, '[AUTO-SEED] LOT:PNT-2602-03 / PROC:BK01 / SHIFT:C / paint line use',     @u_line1,   NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'BOLT-M10'),     'OUT', 5200, '[AUTO-SEED] LOT:BLT-2602-11 / PROC:AS01 / SHIFT:B / final assy use',      @u_line1,   NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'ENG-20T'),      'OUT',  210, '[AUTO-SEED] LOT:ENG-2602-02 / PROC:AS01 / SHIFT:B / final assy use',      @u_line1,   NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'TRN-8AT'),      'OUT',  210, '[AUTO-SEED] LOT:TRN-2602-05 / PROC:AS01 / SHIFT:B / final assy use',      @u_line1,   NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'BAT-12V'),      'OUT',  210, '[AUTO-SEED] LOT:BAT-2602-04 / PROC:AS01 / SHIFT:C / final assy use',      @u_line1,   NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'TIRE-18'),      'OUT',  840, '[AUTO-SEED] LOT:TIR-2602-07 / PROC:AS01 / SHIFT:C / final assy use',      @u_line1,   NOW(), NOW()),

  ((SELECT id FROM items WHERE item_code = 'BRKT-FRT-A'),   'IN',  1200, '[AUTO-SEED] LOT:BRK-2602-10 / PROC:BK01 / SHIFT:C / FG from PO-26A-0001', @u_line1, NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'PIPE-BRAKE-R'), 'IN',   640, '[AUTO-SEED] LOT:PIP-2602-12 / PROC:AA04 / SHIFT:B / WIP from PO-26A-0002', @u_line1, NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'SHAFT-DRV-F'),  'IN',   250, '[AUTO-SEED] LOT:SHF-2602-09 / PROC:AS01 / SHIFT:A / WIP from PO-26A-0003', @u_line1, NOW(), NOW()),
  ((SELECT id FROM items WHERE item_code = 'CAR-SEDAN-A'),  'IN',    40, '[AUTO-SEED] LOT:CAR-2602-15 / PROC:EOL / SHIFT:B / trial build lot',       @u_line1, NOW(), NOW());

COMMIT;

-- quick check
SELECT 'items' AS t, COUNT(*) AS c FROM items
UNION ALL SELECT 'production_orders', COUNT(*) FROM production_orders
UNION ALL SELECT 'stock_history', COUNT(*) FROM stock_history;
