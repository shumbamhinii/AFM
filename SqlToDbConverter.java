import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SqlToDbConverter {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:bible.db"; // Path to the .db file

        try (Connection conn = DriverManager.getConnection(url)) {
            if (conn != null) {
                System.out.println("Connected to the database.");
                // Now you can perform SQL operations on the .db file
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}
