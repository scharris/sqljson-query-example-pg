-- [ THIS QUERY WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST. ]
-- JSON_OBJECT_ROWS results representation for drugs query 1
select
  -- row object for table 'drug'
  jsonb_build_object(
    'name', q.name,
    'categoryCode', q."categoryCode",
    'description', q.description,
    'cidPlus1000', q."cidPlus1000"
  ) json
from (
  -- base query for table 'drug'
  select
    d.name as name,
    d.category_code "categoryCode",
    d.descr as description,
    d.cid + 1000 "cidPlus1000"
  from
    drug d
  where (
    (category_code = :catCode)
  )
) q
