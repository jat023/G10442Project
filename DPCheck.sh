# Use this script only if the apk given is a copy.
# Right now the script will convert it to a zip file but later the zip file will be removed in the clean up process.

# Create storage file for xml results if storage file does not exist
mkdir -p xml

# Rename all *.apk to *.zip
for f in *.apk; do
mv "$f" "${f%.apk}.zip"
done

# Extract zip file
for f in *.zip; do
unzip "$f" -d unzippedAPK
done

cd unzippedAPK
# Move classes.dex file out of unzippedAPK
for f in *.dex; do
mv "$f" ../
done

# Get out of unzippedAPK
cd ..

# Move classes.dex files into dex2jar file for conversion
for f in *.dex; do
mv "$f" dex2jar-2.0/
done

# Convert all classes.dex into jar files
cd dex2jar-2.0
for f in *.dex; do
./d2j-dex2jar.sh "$f"
done

# Move jar files out of dex2jar dir
for f in *.jar; do
mv "$f" ../
done

# Remove .dex files from dex2jar dir
for f in *.dex; do
rm "$f"
done

# Get out of dex2jar dir
cd ..

# Move jar files into dependency-check
for f in *.jar; do
mv "$f" dependency-check/
done

cd dependency-check
# Run DC on jar files
a=1
for f in *.jar; do
new=$(printf "DCreport%04d.xml" "$a")
./bin/dependency-check.sh -f XML --project DCResults --out . --scan "$f"
mv -- dependency-check-report.xml "$new"
let a=a+1
rm "$f"
done

# Move xml result out of dependency-check
mv DCreport0001.xml ../xml/

# Delete other extra reports
for f in *.xml; do
rm "$f"
done

# Get out of dependency-check
cd ..

# Clean up temp files
rm -r unzippedAPK

# Assuming the apk given is a copy, remove the copy.
for f in *.zip; do
rm "$f"
done
