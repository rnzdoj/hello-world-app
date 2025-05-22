pipeline {
  agent any

  environment {
    IMAGE = "rnzdoj/hello-world-app:${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Image') {
      steps {
        bat """
          docker build -t %IMAGE% .
        """
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          bat """
            echo %PASS% | docker login -u %USER% --password-stdin
            docker push %IMAGE%
          """
        }
      }
    }

    stage('Update Manifests') {
      steps {
        bat """
          powershell -Command "(Get-Content k8s/deployment.yaml) -replace 'image:.*', 'image: ${IMAGE}' | Set-Content k8s/deployment.yaml"
        """

        bat """
          git config user.email "rinzin.bhutan.asia@gmail.com"
          git config user.name "rnzdoj"
          git add k8s/deployment.yaml
          git commit -m "Update image to ${IMAGE}"
          git push origin main
        """
      }
    }
  }
}
