import sqlite3
import arabic_reshaper
from bidi.algorithm import get_display
import requests

# Connect to the database
conn = sqlite3.connect('surah_info.db')
cursor = conn.cursor()

# Open a text file to write the single SQL insert statement
with open('quran_inserts.txt', 'w', encoding='utf-8') as f:
    # Initialize the insert statement
    insert_statement = "INSERT INTO `Quran_Explorer`.`ayahInfo` VALUES "
    
    # Fetch Surah names and their Ayah counts from the database
    cursor.execute("SELECT SurahNumber, SurahName, AyahCount FROM SurahAyahCount")
    surah_data = cursor.fetchall()

    # Loop through each Surah
    for surah_number, surah_name, ayah_count in surah_data:
        # Loop through each Ayah in the Surah
        for ayah_num in range(1, ayah_count + 1):
            verseUrl = f"https://api.quran.com/api/v4/quran/verses/indopak?verse_key={surah_number}:{ayah_num}"
            audioUrl = f"https://api.quran.com/api/v4/recitations/?/by_ayah/{surah_number}:{ayah_num}"

            # Make a GET request to the API
            response = requests.get(verseUrl)

            # Check if the request was successful
            if response.status_code == 200:
                # Parse the JSON response
                data = response.json()
                # Extract the Arabic text
                arabic_text = data["verses"][0]["text_indopak"]

                # Check for any errors in the text
                if "" in arabic_text:
                    print("Error in text rendering")
                    arabic_text = arabic_text.replace('', '')

                # Add the Ayah data to the insert statement
                insert_statement += f"({surah_number}, {ayah_num}, \"{verseUrl}\", \"{audioUrl}\", \"{arabic_text}\"),\n"

                # Write the insert statement to the file after every loop
                f.write(insert_statement)
                # Reset the insert statement for the next iteration
                insert_statement = ""
            else:
                print(f"Failed to fetch data for {surah_name} Ayah {ayah_num}: {response.status_code}")

# Close the database connection
conn.close()
