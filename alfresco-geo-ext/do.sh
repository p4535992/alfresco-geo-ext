#!/bin/sh


mvn install
cp target/alfresco-geo-ext-1.0.amp /home/alfresco/alfresco/amps/
mvn clean
/etc/init.d/alfresco liveinstall

sleep 5
tail -f /home/alfresco/alfresco/tomcat/logs/catalina.out | more
