# Assume that the apk will be copied into dex2jar before running this script
cd dex2jar-2.0

for f in *.apk; do
./d2j-dex2jar.sh "$f"
rm "$f"
done

for f in *.jar; do
mv "$f" ../findbugs
done

cd ../findbugs-3.0.1

for f in *dex2jar.jar; do
java -jar bin/findbugs.jar -textui -xml:withMessages -output .xml> FBReport​ "$f"
rm "$f"
done

for f in *.xml; do
mv "$f" ../xml
done
