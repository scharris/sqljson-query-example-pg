package javapkg;


import java.util.*;
import java.math.*;
import java.time.*;
import org.checkerframework.checker.nullness.qual.Nullable;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.checkerframework.framework.qual.DefaultQualifier;
import org.checkerframework.framework.qual.TypeUseLocation;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.*;


public class DrugForIdQuery
{
  // The types defined in this file correspond to results of the following generated SQL queries.
  public static final String sqlResource = "drug-for-id-query.sql";


  // Below are types representing the result data for the generated query, with top-level result type first.

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class Drug
  {
    public BigDecimal id;
    public String name;
    public @Nullable String description;
    public String category;
    public @Nullable String meshId;
    public @Nullable BigDecimal cid;
    public @Nullable String registered;
    public @Nullable String marketEntryDate;
    public @Nullable String therapeuticIndications;
    public @Nullable Long cidPlus1000;
    public Analyst registeredByAnalyst;
    public Compound compound;
    public List<Brand> brands;
    public List<Advisory> advisories;
    public List<DrugFunctionalCategory> functionalCategories;
  }

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class Analyst
  {
    public BigDecimal id;
    public String shortName;
  }

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class Compound
  {
    public @Nullable String displayName;
    public @Nullable String nctrIsisId;
    public @Nullable String cas;
    public @Nullable String entered;
    public Analyst enteredByAnalyst;
    public @Nullable Analyst approvedByAnalyst;
  }

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class Brand
  {
    public String brandName;
    public @Nullable String manufacturer;
  }

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class Advisory
  {
    public String advisoryText;
    public String advisoryType;
    public String authorityName;
    public @Nullable String authorityUrl;
    public @Nullable String authorityDescription;
    public int exprYieldingTwo;
  }

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class DrugFunctionalCategory
  {
    public String categoryName;
    public @Nullable String description;
    public String authorityName;
    public @Nullable String authorityUrl;
    public @Nullable String authorityDescription;
  }

}
