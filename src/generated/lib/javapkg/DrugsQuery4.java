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


public class DrugsQuery4
{
  // The types defined in this file correspond to results of the following generated SQL queries.
  public static final String sqlResource = "drugs-query-4.sql";


  // query parameters
  public static final String catCodeParam = "catCode";

  // Below are types representing the result data for the generated query, with top-level result type first.

  public record Drug(
    String drugName,
    String categoryCode,
    String registeredByAnalyst,
    Compound primaryCompound,
    List<Advisory> advisories
  ){}

  public record Compound(
    long compoundId,
    @Nullable String compoundDisplayName,
    String enteredByAnalyst,
    @Nullable String approvedByAnalyst
  ){}

  public record Advisory(
    long advisoryTypeId,
    String advisoryText
  ){}

}
