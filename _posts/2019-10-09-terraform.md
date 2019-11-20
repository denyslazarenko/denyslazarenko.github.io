---
title: Learning Terraform 
layout: post
use_toc: true
excerpt: Here I collected information which was helpful for me to learn about Terraform
---

### References
  - Books:Getting started with Terraform 2nd edition(Packt)
  - [Terraform guides](https://github.com/hashicorp/terraform-guides)
  - [Create reusable infrastructure](https://medium.com/faun/creating-reusable-infrastructure-with-terraform-on-gcp-e17745ac4ff2)
  - Automating Terraform deploys with Gitlab pipeline
      - https://medium.com/@timhberry/terraform-pipelines-in-gitlab-415b9d842596
      - https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow
  - [gloud Cheat Sheet](https://gist.github.com/pydevops/cffbd3c694d599c6ca18342d3625af97#other-cheatsheets) 

### Vocabulary
   - Software as a Service (SaaS)
   - Infrastructure as Code (IaC)

### Structure
- *terraform\modules*
    * gcp
        - `backend.tf` – Remote State(before we need to have Google Cloud Storage: ```gsutil mb -c regional -l europe-west1 gs://<your-project-id>-tfstate```)
        - `main.tf` – for the connection to GCP.
        - `kubernetes.tf` – for the configuration defining the characteristics of the Kubernetes cluster I’m working toward getting built.
        - `terraform.tfvars` – for assigning variables created in variables.tf.
        - `variables.tf` – for declaring and adding doc/descriptions for the variables I use.

### k8s Cluster role
```yaml
	provider "kubernetes" {}

	resource "kubernetes_cluster_role_binding" "service-default-experimental" {
	  metadata {
	    name = "service-default-experimental"
	  }
	  role_ref {
	    api_group = "rbac.authorization.k8s.io"
	    kind = "ClusterRole"
	    name = "cluster-admin"
	  }
	  subject {
	    kind      = "ServiceAccount"
	    name      = "default"
	    namespace = "default"
	  }
	}
```
### Deploy dev/prod environments:
1. terraform workspace new dev
2. terraform workspace select (dev/prod)
3. terraform plan -var-file="dev.tfvars" -out=dev.out
4. terraform apply "dev.out"

