---
title: Learning Kubernetes 
layout: post
use_toc: true
excerpt: Here I collected information which was helpful for me to learn about k8s
---

#### References
 * Book: Kubernetes in Action by Marko Lukša
 * [Extensive guide how to set up GCP and run k8s and terraform scripts](https://medium.com/faun/google-kubernetes-engine-explain-like-im-five-1890e550c099)
 * [FreeCodeCamp article about basic microservices deployment](https://www.freecodecamp.org/news/learn-kubernetes-in-under-3-hours-a-detailed-guide-to-orchestrating-containers-114ff420e882/)
 * [Kubernetes By Example: collection of frequently used components](http://kubernetesbyexample.com/)
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
```yaml
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

```bash
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
- create a rbac clusterRole(you need to have permission in order to do it)
```
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
 name: service-default-experimental
subjects:
 - kind: ServiceAccount
   name: default
   namespace: default
roleRef:
 kind: ClusterRole
 name: cluster-admin
 apiGroup: rbac.authorization.k8s.io
```

#### GKE limitation
 - It is not possible to run nodes in differnet regions. You need to have different clusters for different regions and then use `Istio` to coordinate it. 
 - https://github.com/kubernetes/kubernetes/issues/33777#issuecomment-426487268

#### GKE pools 
A node pool is simply a “pool,” of machines with the same configuration. This feature allows the creation of heterogeneous GKE clusters.

#### Setup Kubernetes CLI
Interaction with the cluster is only possible via the Kubernetes CLI, to have a minimum of security. Additional security features are currently not configured for the development environment.
 - Install the CLI as described here
 - Check if the .kube directory was created in your home directory. If it was not created, do so manually
 
#### Dashboard
```sh
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep eks-admin | awk '{print $1}')
kubectl proxy
```
[proxy location](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/login)
