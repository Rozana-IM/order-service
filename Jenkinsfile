pipeline {
    agent any

    environment {
        AWS_REGION     = "us-east-1"
        AWS_ACCOUNT_ID = "789890001348"

        ECR_REPO  = "order-service"
        ECR_URI   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
        IMAGE_TAG = "${BUILD_NUMBER}"

        ECS_CLUSTER = "lucci-cluster"
        ECS_SERVICE = "order-service-service-dehx0nya"
        TASK_FAMILY = "order-service"

        DOCKER_BUILDKIT = "1"

    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login ECR') {
            steps {
                sh '''
                #!/bin/bash
                set -eux

                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS \
                --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Build & Push Image') {
    steps {
        sh '''
        #!/bin/bash
        set -eux

        docker system prune -af || true
        docker build \
        --progress=plain \
        -t $ECR_REPO:$IMAGE_TAG .
  
        docker tag $ECR_REPO:$IMAGE_TAG $ECR_URI:$IMAGE_TAG
        docker tag $ECR_REPO:$IMAGE_TAG $ECR_URI:latest

        docker push $ECR_URI:$IMAGE_TAG
        docker push $ECR_URI:latest
        '''
    }
}

        stage('Create NEW Task Revision') {
            steps {
                sh '''
                #!/bin/bash
                set -eux

                aws ecs describe-task-definition \
                  --task-definition $TASK_FAMILY \
                  --region $AWS_REGION \
                  > task-def.json

                jq --arg IMAGE "$ECR_URI:$IMAGE_TAG" '
                  .taskDefinition
                  | del(
                      .taskDefinitionArn,
                      .revision,
                      .status,
                      .requiresAttributes,
                      .compatibilities,
                      .registeredAt,
                      .registeredBy
                    )
                  | .containerDefinitions |= map(
                        if .name == "order-service"
                        then .image = $IMAGE
                        else .
                        end
                    )
                ' task-def.json > new-task-def.json

                aws ecs register-task-definition \
                  --region $AWS_REGION \
                  --cli-input-json file://new-task-def.json \
                  > task-output.json

                jq -r '.taskDefinition.revision' task-output.json > revision.txt
                '''
            }
        }

        stage('Deploy New Revision') {
            steps {
                sh '''
                #!/bin/bash
                set -eux

                REVISION=$(cat revision.txt)

                aws ecs update-service \
                  --cluster $ECS_CLUSTER \
                  --service $ECS_SERVICE \
                  --task-definition $TASK_FAMILY:$REVISION \
                  --region $AWS_REGION
                '''
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
    }
}
