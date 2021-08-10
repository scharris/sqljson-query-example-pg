package org.sqljson;

import java.io.IOError;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.jdbi.v3.core.Jdbi;

public class DbmdFetcher
{
  private static String usage()
  {
    return
      "Expected arguments: <jdbc-props-file> <database-type> <rel-pattern> <output-file>\n" +
      "  jdbc-props-file: JDBC properties file, with properties jdbc.driverClassName, jdbc.url, " +
      "jdbc.username, jdbc.password.\n" +
      "  database-type: 'pg' or 'ora', for a PostgreSQL or Oracle database, respectively\n" +
      "  rel-pattern: Table/view name pattern.\n" +
      "  output-file: File to which to write query result json value.\n";
  }

  public static Jdbi createJdbi(Path propsFile)
  {
    try
    {
      Properties props = new Properties();
      props.load(Files.newInputStream(propsFile));
      if ( !props.containsKey("jdbc.driverClassName") ||
           !props.containsKey("jdbc.url") ||
           !props.containsKey("jdbc.username") ||
           !props.containsKey("jdbc.password") )
        throw new RuntimeException(
          "Expected connection properties " +
          "{ jdbc.driverClassName, jdbc.url, jdbc.username, jdbc.password } " +
          "in connection properties file."
        );

      Class.forName(props.getProperty("jdbc.driverClassName"));

      return Jdbi.create(
        props.getProperty("jdbc.url"),
        props.getProperty("jdbc.username"),
        props.getProperty("jdbc.password")
      );
    }
    catch(Exception e)
    {
      throw new RuntimeException(e);
    }
  }

  public static InputStream getResourceInputStream(String resourcePath)
  {
    InputStream is = DbmdFetcher.class.getClassLoader().getResourceAsStream(resourcePath);
    if ( is == null )
      throw new RuntimeException("Resource not found: " + resourcePath);
    return is;
  }

  public static String readResourceUtf8(String resourcePath)
  {
    try
    {
      InputStream is = getResourceInputStream(resourcePath);
      return new String(is.readAllBytes(), StandardCharsets.UTF_8);
    }
    catch(IOException e)
    {
      throw new IOError(e);
    }
  }

  public static void main(String[] args)
  {
    boolean helpRequested = args.length == 1 && (args[0].equals("-h") || args[0].equals("--help"));
    if ( helpRequested )
    {
      System.out.println(usage());
      return;
    }

    if ( args.length != 4 )
    {
      System.err.println("Expected arguments: " + usage());
      System.exit(1);
    }

    Path jdbcPropsFile = Paths.get(args[0]);
    String dbType = args[1];
    String relPat = args[2];
    Path outputFile = Paths.get(args[3]);

    if ( !Files.isRegularFile(jdbcPropsFile) )
      throw new RuntimeException("File not found: " + jdbcPropsFile);

    try
    {
      String sql = readResourceUtf8(dbType + "-dbmd.sql");
      Jdbi jdbi = createJdbi(jdbcPropsFile);

      String resultJson = jdbi.withHandle(db ->
        db.createQuery(sql)
        .bind("relPat", relPat)
        .mapTo(String.class)
        .one()
      );

      Files.writeString(outputFile, resultJson);
    }
    catch(Throwable t)
    {
      System.err.println(t.getMessage());
      System.exit(1);
    }
  }
}
