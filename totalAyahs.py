import sqlite3

# Connect to the SQLite database
# The database file is 'surah_info.db'
def connect_to_db(db_name="surah_info.db"):
    conn = sqlite3.connect(db_name)
    return conn

# Query the database and fetch all rows from a specific table
def query_db(conn, query, params=()):
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    return rows

# Example usage
def main():
    # Connect to the database
    conn = connect_to_db()

    # Define the SQL query
    sql_query = "SELECT sum(AyahCount) FROM SurahAyahCount"

    # Execute the query
    rows = query_db(conn, sql_query)

    # Print the results
    for row in rows:
        print(row)

    # Close the connection
    conn.close()

if __name__ == "__main__":
    main()
