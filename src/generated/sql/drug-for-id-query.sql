-- [ THIS QUERY WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST. ]
-- JSON_OBJECT_ROWS results representation for drug for id query
select
  -- row object for table 'drug'
  jsonb_build_object(
    'id', q.id,
    'name', q.name,
    'description', q.description,
    'category', q.category,
    'meshId', q."meshId",
    'cid', q.cid,
    'registered', q.registered,
    'marketEntryDate', q."marketEntryDate",
    'therapeuticIndications', q."therapeuticIndications",
    'cidPlus1000', q."cidPlus1000",
    'registeredByAnalyst', q."registeredByAnalyst",
    'compound', q.compound,
    'prioritizedReferences', q."prioritizedReferences",
    'brands', q.brands,
    'advisories', q.advisories,
    'functionalCategories', q."functionalCategories"
  ) json
from (
  -- base query for table 'drug'
  select
    d.id as id,
    d.name as name,
    d.descr as description,
    d.category_code as category,
    d.mesh_id "meshId",
    d.cid as cid,
    d.registered as registered,
    d.market_entry_date "marketEntryDate",
    d.therapeutic_indications "therapeuticIndications",
    d.cid + 1000 "cidPlus1000",
    -- reference 'registeredByAnalyst' to parent table 'analyst'
    (
      select
        -- row object for table 'analyst'
        jsonb_build_object(
          'id', q.id,
          'shortName', q."shortName"
        ) json
      from (
        -- base query for table 'analyst'
        select
          a.id as id,
          a.short_name "shortName"
        from
          analyst a
        where (
          d.registered_by = a.id
        )
      ) q
    ) "registeredByAnalyst",
    -- reference 'compound' to parent table 'compound'
    (
      select
        -- row object for table 'compound'
        jsonb_build_object(
          'displayName', q."displayName",
          'nctrIsisId', q."nctrIsisId",
          'cas', q.cas,
          'entered', q.entered,
          'enteredByAnalyst', q."enteredByAnalyst",
          'approvedByAnalyst', q."approvedByAnalyst"
        ) json
      from (
        -- base query for table 'compound'
        select
          c.display_name "displayName",
          c.nctr_isis_id "nctrIsisId",
          c.cas as cas,
          c.entered as entered,
          -- reference 'enteredByAnalyst' to parent table 'analyst'
          (
            select
              -- row object for table 'analyst'
              jsonb_build_object(
                'id', q.id,
                'shortName', q."shortName"
              ) json
            from (
              -- base query for table 'analyst'
              select
                a.id as id,
                a.short_name "shortName"
              from
                analyst a
              where (
                c.entered_by = a.id
              )
            ) q
          ) "enteredByAnalyst",
          -- reference 'approvedByAnalyst' to parent table 'analyst'
          (
            select
              -- row object for table 'analyst'
              jsonb_build_object(
                'id', q.id,
                'shortName', q."shortName"
              ) json
            from (
              -- base query for table 'analyst'
              select
                a.id as id,
                a.short_name "shortName"
              from
                analyst a
              where (
                c.approved_by = a.id
              )
            ) q
          ) "approvedByAnalyst"
        from
          compound c
        where (
          d.compound_id = c.id
        )
      ) q
    ) compound,
    -- collection 'prioritizedReferences' of records from child table 'drug_reference'
    (
      select
        -- aggregated rows from table 'drug_reference'
        coalesce(jsonb_agg(jsonb_build_object(
          'priority', q.priority,
          'publication', q.publication
        ) order by priority asc),'[]'::jsonb) json
      from (
        -- base query for table 'drug_reference'
        select
          dr.priority as priority,
          -- field(s) inlined from parent table 'reference'
          q.publication
        from
          -- base query for table 'drug_reference'
          drug_reference dr
          -- parent table 'reference', joined for inlined fields
          left join (
            select
              r.id as "_id",
              r.publication as publication
            from
              reference r
          ) q on dr.reference_id = q."_id"
        where (
          dr.drug_id = d.id
        )
        order by priority asc
      ) q
    ) "prioritizedReferences",
    -- collection 'brands' of records from child table 'brand'
    (
      select
        -- aggregated rows from table 'brand'
        coalesce(jsonb_agg(jsonb_build_object(
          'brandName', q."brandName",
          'manufacturer', q.manufacturer
        )),'[]'::jsonb) json
      from (
        -- base query for table 'brand'
        select
          b.brand_name "brandName",
          -- field(s) inlined from parent table 'manufacturer'
          q.manufacturer
        from
          -- base query for table 'brand'
          brand b
          -- parent table 'manufacturer', joined for inlined fields
          left join (
            select
              m.id as "_id",
              m.name as manufacturer
            from
              manufacturer m
          ) q on b.manufacturer_id = q."_id"
        where (
          b.drug_id = d.id
        )
      ) q
    ) brands,
    -- collection 'advisories' of records from child table 'advisory'
    (
      select
        -- aggregated rows from table 'advisory'
        coalesce(jsonb_agg(jsonb_build_object(
          'advisoryText', q."advisoryText",
          'advisoryType', q."advisoryType",
          'exprYieldingTwo', q."exprYieldingTwo",
          'authorityName', q."authorityName",
          'authorityUrl', q."authorityUrl",
          'authorityDescription', q."authorityDescription"
        )),'[]'::jsonb) json
      from (
        -- base query for table 'advisory'
        select
          a.text "advisoryText",
          -- field(s) inlined from parent table 'advisory_type'
          q."advisoryType",
          q."exprYieldingTwo",
          q."authorityName",
          q."authorityUrl",
          q."authorityDescription"
        from
          -- base query for table 'advisory'
          advisory a
          -- parent table 'advisory_type', joined for inlined fields
          left join (
            select
              at.id as "_id",
              at.name "advisoryType",
              (1 + 1) "exprYieldingTwo",
              -- field(s) inlined from parent table 'authority'
              q."authorityName",
              q."authorityUrl",
              q."authorityDescription"
            from
              advisory_type at
              -- parent table 'authority', joined for inlined fields
              left join (
                select
                  a.id as "_id",
                  a.name "authorityName",
                  a.url "authorityUrl",
                  a.description "authorityDescription"
                from
                  authority a
              ) q on at.authority_id = q."_id"
          ) q on a.advisory_type_id = q."_id"
        where (
          a.drug_id = d.id
        )
      ) q
    ) advisories,
    -- collection 'functionalCategories' of records from child table 'drug_functional_category'
    (
      select
        -- aggregated rows from table 'drug_functional_category'
        coalesce(jsonb_agg(jsonb_build_object(
          'categoryName', q."categoryName",
          'description', q.description,
          'authorityName', q."authorityName",
          'authorityUrl', q."authorityUrl",
          'authorityDescription', q."authorityDescription"
        )),'[]'::jsonb) json
      from (
        -- base query for table 'drug_functional_category'
        select
          -- field(s) inlined from parent table 'functional_category'
          q."categoryName",
          q.description,
          -- field(s) inlined from parent table 'authority'
          q1."authorityName",
          q1."authorityUrl",
          q1."authorityDescription"
        from
          -- base query for table 'drug_functional_category'
          drug_functional_category dfc
          -- parent table 'functional_category', joined for inlined fields
          left join (
            select
              fc.id as "_id",
              fc.name "categoryName",
              fc.description as description
            from
              functional_category fc
          ) q on dfc.functional_category_id = q."_id"
          -- parent table 'authority', joined for inlined fields
          left join (
            select
              a.id as "_id",
              a.name "authorityName",
              a.url "authorityUrl",
              a.description "authorityDescription"
            from
              authority a
          ) q1 on dfc.authority_id = q1."_id"
        where (
          dfc.drug_id = d.id
        )
      ) q
    ) "functionalCategories"
  from
    drug d
  where (
    (d.id = $1)
  )
  order by d.name
) q
order by q.name
