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


public class DrugsQuery1
{
  // The types defined in this file correspond to results of the following generated SQL queries.
  public static final String sqlResource = "drugs-query-1.sql";


  // query parameters
  public static final String catCodeParam = "catCode";

  // Below are types representing the result data for the generated query, with top-level result type first.

  public record Drug(
    String drugName,
    String categoryCode,
    @Nullable Long cidPlus1000
  ){}

}
