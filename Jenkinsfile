pipeline {
  agent any

  environment {
    IMAGE = "rnzdoj/hello-world-app:${BUILD_NUMBER}"
  }

  stages {
    stage('Build Image') {
      steps {
        bat 'docker build -t $IMAGE .'
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          bat 'echo $PASS | docker login -u $USER --password-stdin'
          bat 'docker push $IMAGE'
        }
      }
    }

    stage('Update Manifests') {
      steps {
        bat '''
          sed -i "s|image:.*|image: $IMAGE|g" k8s/deployment.yaml
          git config user.email "ci@example.com"
          git config user.name "jenkins"
          git add k8s/deployment.yaml
          git commit -m "Update image to $IMAGE"
          git push origin main
        '''
      }
    }
  }
}
