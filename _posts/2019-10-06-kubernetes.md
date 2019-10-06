---
title: Learning Kubernetes 
layout: post
use_toc: true
excerpt: Here I collected information which was helpful for me to learn about k8s
---

#### References
  * Book: Kubernetes in Action by Marko Lukša
  * [FreeCodeCamp article about basic microservices deployment](https://www.freecodecamp.org/news/learn-kubernetes-in-under-3-hours-a-detailed-guide-to-orchestrating-containers-114ff420e882/)
  * [Kubernetes By Example: collectio of mostly used components](http://kubernetesbyexample.com/)
  * [Blog posts about k8s and ML](https://mlinproduction.com/k8s-pods/)
  * [New free video course from VMware](https://kubernetes.academy/)
  * Linux Academy courses
      - [Helm deep dive](https://linuxacademy.com/course/helm-deep-dive-part-1/)
      - [Practical course: Learn Kubernetes by Doing](https://linuxacademy.com/course/learn-kubernetes-by-doing/)
   

#### Make service be visible externally: 
Normally, services are available only locally. In order to make them available from outside we need additional service LoadBalancer, where we need to specify appropriate port and name.   
``` 
kubectl expose svc rabbitmq --port=9376 --target-port=9376 --type=LoadBalancer --name=rabbitmq-lb
```
or equivalently with k8s:
```
apiVersion: v1
kind: Service
metadata:
  name: rabbitmq-lb
spec:
  selector:
    app: rabbitmq
  ports:
    - name: rabbitmq-mgmt-port
      protocol: TCP
      port: 9376
      targetPort: 9376
    - name: rabbitmq-amqp-port
      protocol: TCP
      port: 5672
      targetPort: 5672
  type: LoadBalancer
  ```

  #### Remotely executing commands in running containers
  ```$ kubectl exec kubia-7nog1 -- curl -s http://10.111.249.153```
  
  #### [Python kubernetes_client](https://github.com/kubernetes-client/python/tree/master/kubernetes)
  
 [Blog post: How to create k8s job with Python](https://blog.pythian.com/how-to-create-kubernetes-jobs-with-python/)
 
 In order to connect to the k8s cluster it is necessary to have `API_TOKEN`. 
 
 ```
  # Check all possible clusters, as you .KUBECONFIG may have multiple contexts:
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'
 
# Select name of cluster you want to interact with from above output:
export CLUSTER_NAME="some_server_name"
 
# Point to the API server refering the cluster name
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")
 
# Gets the token value
TOKEN=$(kubectl get secrets -o jsonpath="{.items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='default')].data.token}"|base64 -d)
```
In order to deal with `403` Error follow next steps:
https://github.com/papudatta/kubernetes_kubeadm
