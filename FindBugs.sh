# Assume that the apk will be copied into dex2jar before running this script
cd dex2jar-2.0


#chmod -x d2j_invoke.sh
chmod u+x d2j-dex2jar.sh

for f in *.apk; do
sh d2j-dex2jar.sh "$f"
rm "$f"
done

for f in *.jar; do
mv "$f" ../findbugs-3.0.1
done

cd ../findbugs-3.0.1

for f in *dex2jar.jar; do
java -jar lib/findbugs.jar -textui -xml:withMessages -output fbreport.xml "$f"
#rm "$f"
done

mv fbreport.xml ../xml
