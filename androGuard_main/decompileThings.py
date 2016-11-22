#!/usr/bin/python

from sys import argv
from sys import exit
import os
from androguard.core.bytecodes import apk
from androguard.core.bytecodes import dvm
from androguard.decompiler.dad import decompile
from androguard.core.analysis import analysis

def convert_descriptor(name):
    name = name[1:]
    return name.replace("/",".").replace(";","")

def convert_field_desc(name,field_desc):
    return  

def check_dirs(directory):
        if not os.path.exists(PREFIX+directory):
            try:
                os.makedirs(PREFIX+directory)   
            except:
                pass

def check_path(class_path):
        org_path = class_path.replace(".","/")
        paths = org_path.split("/")
        paths = paths[:len(paths)-1]
        for index,folder in enumerate(paths):
            check_dirs('/'.join(paths[:index+1]))   
        return PREFIX+org_path+".java"

if __name__=="__main__":
    if len(argv) != 3:
        print "Usage: ./decompiler [APK file INPUT] [OUTPUT_DIRECTORY]"
        print "***Please ensure you use the full path for OUTPUT_DIRECTORY...***"
        exit(1)
    PREFIX=argv[2]  
    if not os.path.exists(PREFIX):
        print "Output directory '%s' does not exist..." % (PREFIX)
        exit(1)
    elif not os.path.exists(argv[2]):   
        print "APK file '%s' not found..." % (argv[2])
        exit(1)
    a = apk.APK(argv[1])
    d = dvm.DalvikVMFormat(a.get_dex())
    vmx = analysis.newVMAnalysis(d)
    for _class in d.get_classes():
        class_path = convert_descriptor(_class.get_name())
        path = check_path(class_path)
        print "[*] Writing ...'",path,"'"
        if not os.path.exists(path):
            java = open(path,"w")
            for field in _class.get_fields():
                access_flags = field.get_access_flags_string()
                if access_flags == "0x0":
                    access_flags = ""
                java.write("\t%s %s %s\n"% (access_flags,convert_descriptor(field.get_descriptor()),field.get_name()))
            for method in _class.get_methods():
                g = vmx.get_method(method)  
                if method.get_code() == None:
                    continue
                ms = decompile.DvMethod(g)
                ms.process()
                for line in ms.get_source().split("\n"):
                    java.write("\t%s\n" % line)
            java.flush()
            java.close()    