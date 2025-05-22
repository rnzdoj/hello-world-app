pipeline {
  agent any

  environment {
    IMAGE_TAG = "rnzdoj/hello-world-app:${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Image') {
      steps {
        bat "docker build -t %IMAGE_TAG% ."
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          bat """
            echo %PASS% | docker login -u %USER% --password-stdin
            docker push %IMAGE_TAG%
          """
        }
      }
    }

    stage('Update Manifests') {
      steps {
        bat """
          powershell -Command "(Get-Content k8s/deployment.yaml) -replace 'image:.*', 'image: %IMAGE_TAG%' | Set-Content k8s/deployment.yaml"
        """
        bat """
          git config user.email "rinzin.bhutan.asia@gmail.com"
          git config user.name "rnzdoj"
          git add k8s/deployment.yaml
          git commit -m \"Update image to %IMAGE_TAG%\"
          git push origin main
        """
      }
    }
  }

  post {
    failure {
      echo "Build failed at stage: ${env.STAGE_NAME}"
    }
  }
}
