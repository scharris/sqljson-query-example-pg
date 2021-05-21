// ---------------------------------------------------------------------------
//   THIS SOURCE CODE WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST.  
// ---------------------------------------------------------------------------

package javapkg;



public class RelationsMetadata
{
  public static class drugs // schema 'drugs'
  {
    public static class authority // relation
    {
      public static String id() { return "drugs.authority"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field name = new Field("name", "varchar", false, null, 200, null, null, null);
      public static final Field url = new Field("url", "varchar", true, null, 500, null, null, null);
      public static final Field description = new Field("description", "varchar", true, null, 2000, null, null, null);
      public static final Field weight = new Field("weight", "int4", true, null, null, 32, 2, 0);
    }
    
    public static class analyst // relation
    {
      public static String id() { return "drugs.analyst"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field short_name = new Field("short_name", "varchar", false, null, 50, null, null, null);
    }
    
    public static class compound // relation
    {
      public static String id() { return "drugs.compound"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field display_name = new Field("display_name", "varchar", true, null, 50, null, null, null);
      public static final Field nctr_isis_id = new Field("nctr_isis_id", "varchar", true, null, 100, null, null, null);
      public static final Field smiles = new Field("smiles", "varchar", true, null, 2000, null, null, null);
      public static final Field canonical_smiles = new Field("canonical_smiles", "varchar", true, null, 2000, null, null, null);
      public static final Field cas = new Field("cas", "varchar", true, null, 50, null, null, null);
      public static final Field mol_formula = new Field("mol_formula", "varchar", true, null, 2000, null, null, null);
      public static final Field mol_weight = new Field("mol_weight", "numeric", true, null, null, null, 10, null);
      public static final Field entered = new Field("entered", "timestamptz", true, null, null, null, null, null);
      public static final Field entered_by = new Field("entered_by", "int4", false, null, null, 32, 2, 0);
      public static final Field approved_by = new Field("approved_by", "int4", true, null, null, 32, 2, 0);
    }
    
    public static class advisory_type // relation
    {
      public static String id() { return "drugs.advisory_type"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field name = new Field("name", "varchar", false, null, 50, null, null, null);
      public static final Field authority_id = new Field("authority_id", "int4", false, null, null, 32, 2, 0);
    }
    
    public static class drug // relation
    {
      public static String id() { return "drugs.drug"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field name = new Field("name", "varchar", false, null, 500, null, null, null);
      public static final Field compound_id = new Field("compound_id", "int4", false, null, null, 32, 2, 0);
      public static final Field mesh_id = new Field("mesh_id", "varchar", true, null, 7, null, null, null);
      public static final Field drugbank_id = new Field("drugbank_id", "varchar", true, null, 7, null, null, null);
      public static final Field cid = new Field("cid", "int4", true, null, null, 32, 2, 0);
      public static final Field category_code = new Field("category_code", "varchar", false, null, 1, null, null, null);
      public static final Field descr = new Field("descr", "varchar", true, null, 500, null, null, null);
      public static final Field therapeutic_indications = new Field("therapeutic_indications", "varchar", true, null, 4000, null, null, null);
      public static final Field registered = new Field("registered", "timestamptz", true, null, null, null, null, null);
      public static final Field registered_by = new Field("registered_by", "int4", false, null, null, 32, 2, 0);
      public static final Field market_entry_date = new Field("market_entry_date", "date", true, null, null, null, null, null);
    }
    
    public static class drug_reference // relation
    {
      public static String id() { return "drugs.drug_reference"; }
      public static final Field drug_id = new Field("drug_id", "int4", false, 1, null, 32, 2, 0);
      public static final Field reference_id = new Field("reference_id", "int4", false, 2, null, 32, 2, 0);
      public static final Field priority = new Field("priority", "int4", true, null, null, 32, 2, 0);
    }
    
    public static class reference // relation
    {
      public static String id() { return "drugs.reference"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field publication = new Field("publication", "varchar", false, null, 2000, null, null, null);
    }
    
    public static class advisory // relation
    {
      public static String id() { return "drugs.advisory"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field drug_id = new Field("drug_id", "int4", false, null, null, 32, 2, 0);
      public static final Field advisory_type_id = new Field("advisory_type_id", "int4", false, null, null, 32, 2, 0);
      public static final Field text = new Field("text", "varchar", false, null, 2000, null, null, null);
    }
    
    public static class functional_category // relation
    {
      public static String id() { return "drugs.functional_category"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field name = new Field("name", "varchar", false, null, 500, null, null, null);
      public static final Field description = new Field("description", "varchar", true, null, 2000, null, null, null);
      public static final Field parent_functional_category_id = new Field("parent_functional_category_id", "int4", true, null, null, 32, 2, 0);
    }
    
    public static class drug_functional_category // relation
    {
      public static String id() { return "drugs.drug_functional_category"; }
      public static final Field drug_id = new Field("drug_id", "int4", false, 1, null, 32, 2, 0);
      public static final Field functional_category_id = new Field("functional_category_id", "int4", false, 2, null, 32, 2, 0);
      public static final Field authority_id = new Field("authority_id", "int4", false, 3, null, 32, 2, 0);
      public static final Field seq = new Field("seq", "int4", true, null, null, 32, 2, 0);
    }
    
    public static class brand // relation
    {
      public static String id() { return "drugs.brand"; }
      public static final Field drug_id = new Field("drug_id", "int4", false, 1, null, 32, 2, 0);
      public static final Field brand_name = new Field("brand_name", "varchar", false, 2, 200, null, null, null);
      public static final Field language_code = new Field("language_code", "varchar", true, null, 10, null, null, null);
      public static final Field manufacturer_id = new Field("manufacturer_id", "int4", true, null, null, 32, 2, 0);
    }
    
    public static class manufacturer // relation
    {
      public static String id() { return "drugs.manufacturer"; }
      public static final Field id = new Field("id", "int4", false, 1, null, 32, 2, 0);
      public static final Field name = new Field("name", "varchar", false, null, 200, null, null, null);
    }
    
  }
}