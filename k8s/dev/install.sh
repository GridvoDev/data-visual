#!/bin/bash
kubectl -n gridvo get svc | grep -q data-visual
if [ "$?" == "1" ];then
	kubectl create -f data_visual-service.yaml --record
	kubectl -n gridvo get svc | grep -q data-visual
	if [ "$?" == "0" ];then
		echo "data_visual-service install success!"
	else
		echo "data_visual-service install fail!"
	fi
else
	echo "data_visual-service is exist!"
fi
kubectl -n gridvo get pods | grep -q data-visual
if [ "$?" == "1" ];then
	kubectl create -f data_visual-deployment.yaml --record
	kubectl -n gridvo get pods | grep -q data-visual
	if [ "$?" == "0" ];then
		echo "data_visual-deployment install success!"
	else
		echo "data_visual-deployment install fail!"
	fi
else
	kubectl delete -f data_visual-deployment.yaml
	kubectl -n gridvo get pods | grep -q data-visual
	while [ "$?" == "0" ]
	do
	kubectl -n gridvo get pods | grep -q data-visual
	done
	kubectl create -f data_visual-deployment.yaml --record
	kubectl -n gridvo get pods | grep -q data-visual
	if [ "$?" == "0" ];then
		echo "data_visual-deployment update success!"
	else
		echo "data_visual-deployment update fail!"
	fi
fi
