-- [ THIS QUERY WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST. ]
-- JSON_OBJECT_ROWS results representation for drugs query 3
select
  -- row object for table 'drug'
  jsonb_build_object(
    'drugName', q."drugName",
    'categoryCode', q."categoryCode",
    'registeredByAnalyst', q."registeredByAnalyst",
    'primaryCompound', q."primaryCompound"
  ) json
from (
  -- base query for table 'drug'
  select
    d.name "drugName",
    d.category_code "categoryCode",
    -- field(s) inlined from parent table 'analyst'
    q."registeredByAnalyst" "registeredByAnalyst",
    -- parent table 'compound' referenced as 'primaryCompound'
    (
      select
        -- row object for table 'compound'
        jsonb_build_object(
          'compoundId', q."compoundId",
          'compoundDisplayName', q."compoundDisplayName",
          'enteredByAnalyst', q."enteredByAnalyst",
          'approvedByAnalyst', q."approvedByAnalyst"
        ) json
      from (
        -- base query for table 'compound'
        select
          c.id "compoundId",
          c.display_name "compoundDisplayName",
          -- field(s) inlined from parent table 'analyst'
          q."enteredByAnalyst" "enteredByAnalyst",
          -- field(s) inlined from parent table 'analyst'
          q1."approvedByAnalyst" "approvedByAnalyst"
        from
          compound c
          -- parent table 'analyst', joined for inlined fields
          left join (
            select
              a.id "_id",
              a.short_name "enteredByAnalyst"
            from
              analyst a
          ) q on c.entered_by = q."_id"
          -- parent table 'analyst', joined for inlined fields
          left join (
            select
              a.id "_id",
              a.short_name "approvedByAnalyst"
            from
              analyst a
          ) q1 on c.approved_by = q1."_id"
        where (
          d.compound_id = c.id
        )
      ) q
    ) "primaryCompound"
  from
    drug d
    -- parent table 'analyst', joined for inlined fields
    left join (
      select
        a.id "_id",
        a.short_name "registeredByAnalyst"
      from
        analyst a
    ) q on d.registered_by = q."_id"
  where (
    (category_code = :catCode)
  )
) q
