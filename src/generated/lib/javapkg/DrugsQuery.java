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


public class DrugsQuery
{
  // The types defined in this file correspond to results of the following generated SQL queries.
  public static final String sqlResource = "drugs-query.sql";


  // Below are types representing the result data for the generated query, with top-level result type first.

  public record Drug(
    long id,
    String name,
    @Nullable String description,
    String category,
    @Nullable String meshId,
    @Nullable Long cid,
    @Nullable String registered,
    @Nullable String marketEntryDate,
    @Nullable String therapeuticIndications,
    @Nullable Long cidPlus1000,
    Analyst registeredByAnalyst,
    Compound compound,
    List<DrugReference> prioritizedReferences,
    List<Brand> brands,
    List<Advisory> advisories,
    List<DrugFunctionalCategory> functionalCategories
  ){}

  public record Analyst(
    long id,
    String shortName
  ){}

  public record Compound(
    @Nullable String displayName,
    @Nullable String nctrIsisId,
    @Nullable String cas,
    @Nullable String entered,
    Analyst enteredByAnalyst,
    @Nullable Analyst approvedByAnalyst
  ){}

  public record DrugReference(
    @Nullable Long priority,
    String publication
  ){}

  public record Brand(
    String brandName,
    @Nullable String manufacturer
  ){}

  public record Advisory(
    String advisoryText,
    String advisoryType,
    String authorityName,
    @Nullable String authorityUrl,
    @Nullable String authorityDescription,
    int exprYieldingTwo
  ){}

  public record DrugFunctionalCategory(
    String categoryName,
    @Nullable String description,
    String authorityName,
    @Nullable String authorityUrl,
    @Nullable String authorityDescription
  ){}

}
