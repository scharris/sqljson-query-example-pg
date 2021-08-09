package javapkg;

import org.checkerframework.checker.nullness.qual.Nullable;

public class Field
{
   public String name;
   public String databaseType;
   public @Nullable Boolean nullable;
   public @Nullable Integer primaryKeyPartNumber;
   public @Nullable Integer length;
   public @Nullable Integer precision;
   public @Nullable Integer precisionRadix;
   public @Nullable Integer fractionalDigits;
   
   public Field
      (
         String name,
         String databaseType,
         @Nullable Boolean nullable,
         @Nullable Integer primaryKeyPartNumber,
         @Nullable Integer length,
         @Nullable Integer precision,
         @Nullable Integer precisionRadix,
         @Nullable Integer fractionalDigits
      )
   {
      this.name = name;
      this.databaseType = databaseType;
      this.nullable = nullable;
      this.primaryKeyPartNumber = primaryKeyPartNumber;
      this.length = length;
      this.precision = precision;
      this.precisionRadix = precisionRadix;
      this.fractionalDigits = fractionalDigits;
   }
   public String toString() { return this.name; }
}
