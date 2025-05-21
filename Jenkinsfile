pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
          checkout scm
      }
    }

    stage('Build Image') {
      steps {
        bat 'docker build -t rnzdoj/hello-world-app:latest .'
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          bat '''
            echo %PASS% | docker login -u %USER% --password-stdin
            docker push rnzdoj/hello-world-app:latest
          '''
        }
      }
    }

    stage('Update Manifests') {
      steps {
        bat '''
          sed -i "s|image:.*|image: 'rnzdoj/hello-world-app:latest'|g" k8s/deployment.yaml
          git config user.email "rinzin.bhutan.asia@gmail.com"
          git config user.name "rnzdoj"
          git add k8s/deployment.yaml
          git commit -m "Update image to rnzdoj/hello-world-app:latest"
          git push origin main
        '''
      }
    }
  }
}
