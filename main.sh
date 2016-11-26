# Main script to run both FindBugs.sh and DPCheck.sh

# Setup the scripts so both will run with chmod
sudo chmod u+x FindBugs.sh
sudo chmod u+x DPCheck.sh

touch apkname.txt

# Make a copy of the APK and move it to dex2jar for FindBugs.sh to run on and store apk name in created xml doc
for f in *.apk; do
echo "$f" >> apkname.txt
cp "$f" dex2jar-2.0
done

mv apkname.txt xml

./FindBugs.sh
./DPCheck.sh
