using Npgsql;

class Program
{
    static void Main()
    {
        var connectionString = "Host=45.91.238.3;Database=rumina;Username=postgres;Password=sGLTccA_Na#9zC;Port=5432";
        
        using var connection = new NpgsqlConnection(connectionString);
        connection.Open();
        
        // Check if role column exists
        var checkQuery = @"
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'role'";
            
        using var checkCommand = new NpgsqlCommand(checkQuery, connection);
        var columnExists = (long)checkCommand.ExecuteScalar() > 0;
        
        if (!columnExists)
        {
            Console.WriteLine("Adding role column to users table...");
            var addColumnQuery = "ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'";
            using var addCommand = new NpgsqlCommand(addColumnQuery, connection);
            addCommand.ExecuteNonQuery();
            Console.WriteLine("Role column added successfully!");
        }
        else
        {
            Console.WriteLine("Role column already exists.");
        }
        
        // Set all existing users to 'user' role if they don't have one
        var updateQuery = "UPDATE users SET role = 'user' WHERE role IS NULL OR role = ''";
        using var updateCommand = new NpgsqlCommand(updateQuery, connection);
        var updated = updateCommand.ExecuteNonQuery();
        Console.WriteLine($"Updated {updated} users with default role.");
    }
} 