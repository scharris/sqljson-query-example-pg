-- [ THIS QUERY WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST. ]
-- JSON_OBJECT_ROWS results representation for drugs query 6
select
  -- row object for table 'drug'
  jsonb_build_object(
    'drugName', q."drugName",
    'categoryCode', q."categoryCode",
    'registeredByAnalyst', q."registeredByAnalyst",
    'primaryCompound', q."primaryCompound",
    'advisories', q.advisories,
    'prioritizedReferences', q."prioritizedReferences"
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
    ) "primaryCompound",
    -- records from child table 'advisory' as collection 'advisories'
    (
      select
        -- aggregated row objects for table 'advisory'
        coalesce(jsonb_agg(jsonb_build_object(
          'advisoryTypeId', q."advisoryTypeId",
          'advisoryText', q."advisoryText",
          'advisoryTypeName', q."advisoryTypeName",
          'advisoryTypeAuthorityName', q."advisoryTypeAuthorityName"
        )),'[]'::jsonb) json
      from (
        -- base query for table 'advisory'
        select
          a.advisory_type_id "advisoryTypeId",
          a.text "advisoryText",
          -- field(s) inlined from parent table 'advisory_type'
          q."advisoryTypeName" "advisoryTypeName",
          q."advisoryTypeAuthorityName" "advisoryTypeAuthorityName"
        from
          advisory a
          -- parent table 'advisory_type', joined for inlined fields
          left join (
            select
              at.id "_id",
              at.name "advisoryTypeName",
              -- field(s) inlined from parent table 'authority'
              q."advisoryTypeAuthorityName" "advisoryTypeAuthorityName"
            from
              advisory_type at
              -- parent table 'authority', joined for inlined fields
              left join (
                select
                  a.id "_id",
                  a.name "advisoryTypeAuthorityName"
                from
                  authority a
              ) q on at.authority_id = q."_id"
          ) q on a.advisory_type_id = q."_id"
        where (
          a.drug_id = d.id
        )
      ) q
    ) as advisories,
    -- records from child table 'drug_reference' as collection 'prioritizedReferences'
    (
      select
        -- aggregated row objects for table 'drug_reference'
        coalesce(jsonb_agg(jsonb_build_object(
          'priority', q.priority,
          'publication', q.publication
        ) order by priority asc),'[]'::jsonb) json
      from (
        -- base query for table 'drug_reference'
        select
          dr.priority as priority,
          -- field(s) inlined from parent table 'reference'
          q.publication as publication
        from
          drug_reference dr
          -- parent table 'reference', joined for inlined fields
          left join (
            select
              r.id "_id",
              r.publication as publication
            from
              reference r
          ) q on dr.reference_id = q."_id"
        where (
          dr.drug_id = d.id
        )
      ) q
    ) "prioritizedReferences"
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
