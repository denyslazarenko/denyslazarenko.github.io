---
title: Learning Terraform 
layout: post
use_toc: true
excerpt: Here I collected information which was helpful for me to learn about Terraform
---

### References
  - Books:Getting started with Terraform 2nd edition(Pact)
  - https://medium.com/@tsadoklf/cloud-recipes-use-terraform-to-create-kubernetes-cluster-and-memorystore-redis-instance-on-gcp-d51bb53df46a
  - https://dzone.com/articles/build-a-kubernetes-cluster-on-gcp-with-terraform
  - https://blog.lelonek.me/how-to-configure-google-kubernetes-engine-using-terraform-cccb67625946
  - https://github.com/hashicorp/terraform-guides
  - Automating Terraform deploys with Gitlab pipeline
      - https://medium.com/@timhberry/terraform-pipelines-in-gitlab-415b9d842596
      - https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow
  - [gloud Cheat Sheet](https://gist.github.com/pydevops/cffbd3c694d599c6ca18342d3625af97#other-cheatsheets) 

### Vocabulary
   - Software as a Service (SaaS)
   - Infrastructure as Code (IaC)

### Declarative vs procedural tools

Perhaps the main benefit of it is that rerunning a declarative definition will never do the same job twice, whereas executing the same shell script will most likely break something on the second run. The proper configuration management tool will ensure that the server is in the exactly same state as defined in your code. This property of modern configuration and provisioning tools is named idempotency. Reapplying an infrastructure template should not do the job twice. If you have a template defining 50 different resources, from EC2 instances to S3 buckets, then you do not want to duplicate or recreate all of them every time you apply the template. You want only missing parts to be created, existing ones to be in the desired state, and the ones which have become obsolete to be destroyed.

You can ensure idempotency yourself inside the script with the high usage of conditional checks. But why reinvent the wheel when there is already a tool to do exactly this job? It would be so much better to just define the end result without composing a sequence of commands to achieve this.

And that is exactly what configuration management tools such as Puppet and Chef do by providing you with a special Domain Specific Language (DSL) to define the desired state of the machine. The certain downside is the necessity to learn a new DSL: a special small language focused on solving one particular task. It's not a complete programming language, neither does it need to be; in this case, its only job is to describe the state of your server
Infrastructure as Code

    Heavy use of source control to store all infrastructure-related code
    Collaboration on this code in the same fashion as applications are developed
    Using unit and integration testing and even applying Test-driven development to infrastructure code
    Introducing continuous integration and continuous delivery to test and release infrastructure code

There is a certain need for a configuration tool that operates one level higher than a setup of a single server; a tool that would allow writing a blueprint that would define all of the high-level pieces at once: servers, cloud services, and even external SaaS products. A tool like this is called given a different name: infrastructure orchestrator, infrastructure provisioner, infrastructure templating, and so on.

### Remote State

We also need to take a quick segue back to Terraform school to learn about remote state. Previously when we’ve run Terraform, you’ll notice that some state files get written to our local directory. Terraform uses these to make its graph of changes every time it runs. So if we run Terraform in a fancy container in a pipeline, where does it write it’s state file?

The answer is to store the state in a bucket in the project itself. Then anyone can run Terraform in the pipeline and the remote state is centrally stored and shared. Terraform will also manage locking of the state to make sure conflicting jobs aren’t run at the same time.

So let’s create a Google Cloud Storage bucket (change your-project-id accordingly):

```gsutil mb -c regional -l europe-west1 gs://<your-project-id>-tfstate```


Now we need to define a remote backend in our Terraform code. Let’s call it `backend.tf` :

```yaml
terraform {
backend "gcs" {
bucket = "<your-project-id>-tfstate"
credentials = "./creds/serviceaccount.json"
	}
}
```

Run terraform init and Terraform will helpfully offer to copy your local state to your new remote backend. Respond with yes then add `backend.tf` to your repo.
Destroy

```terraform destroy```

### Variables

    the string variables (default ones)

    the map variables

    the list variables

### Map
```yaml 
variable "environment" { default = "dev" } 
variable "instance_type" { 
   type = "map" 
   default = { 
     dev = "t2.micro" 
     test = "t2.medium" 
     prod = "t2.large" 
   } 
} 


module "mighty_trousers" { 
  source = "./modules/application" 
  vpc_id = "${aws_vpc.my_vpc.id}" 
  subnet_id = "${aws_subnet.public.id}"
  name = "MightyTrousers" 
  environment = "${var.environment}" 
}
```
Here, we pass a variable from the root module to the application module. We don't need to pass the `instance_type` variable because we will just look at the value we need from the existing variable. To do this, Terraform provides the `lookup()` interpolation function. This function accepts map as the first argument, the key to look for in this map as the second argument, and an optional default value as the third argument.
```yaml
resource "aws_instance" "app-server" { 
  ami = "ami-9bf712f4" 
  instance_type = "${lookup(var.instance_type, var.environment)}" 
  subnet_id = "${var.subnet_id}" 
  vpc_security_group_ids = ["${aws_security_group.allow_http.id}"] 
  tags {
``` 

#### List

```variable "extra_sgs" { default = [] } ```

`concat()` - his function joins multiple lists into one. We also better ensure that the resulting list doesn't have duplicates. The `distinct()` function will help with this; it removes all the duplicates, keeping only the first occurrence of each non-unique element.
```yaml
resource "aws_instance" "app-server" { 
  ami = "ami-9bf712f4" 
  instance_type = "${lookup(var.instance_type, var.environment)}" 
  subnet_id = "${var.subnet_id}" 
  vpc_security_group_ids = ["${distinct(concat(var.extra_sgs, aws_security_group.allow_http.*.id))}"] 
  tags { 
    Name = "${var.name}" 
  } 
} 
```

Terraform does not have loops, this mechanism is implemented by using *.
```aws_security_group.allow_http.*.id   = [aws_security_group.allow_http.0.id .. aws_security_group.allow_http.N.id] ```


