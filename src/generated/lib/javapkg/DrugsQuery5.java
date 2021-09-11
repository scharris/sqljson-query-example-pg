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


public class DrugsQuery5
{
  // The types defined in this file correspond to results of the following generated SQL queries.
  public static final String sqlResource = "drugs-query-5.sql";


  // query parameters
  public static final String catCodeParam = "catCode";

  // Below are types representing the result data for the generated query, with top-level result type first.

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class Drug
  {
    public String drugName;
    public String categoryCode;
    public String registeredByAnalyst;
    public Compound primaryCompound;
    public List<Advisory> advisories;
  }

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class Compound
  {
    public long compoundId;
    public @Nullable String compoundDisplayName;
    public String enteredByAnalyst;
    public @Nullable String approvedByAnalyst;
  }

  @SuppressWarnings("nullness") // because fields will be set directly by the deserializer not by constructor
  public static class Advisory
  {
    public long advisoryTypeId;
    public String advisoryText;
    public String advisoryTypeName;
    public String advisoryTypeAuthorityName;
  }

}
