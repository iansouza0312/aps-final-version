from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import face_recognition_models
import face_recognition
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1999",
    database="minis_meio_ambiente"
)

mycursor = mydb.cursor()

# CREATE THE TABLES
create_table_query = """
    CREATE TABLE IF NOT EXISTS data_table (
    id INT PRIMARY KEY, 
    name VARCHAR(45) NOT NULL, 
    description VARCHAR(255),
    access_level INT
    );"""
mycursor.execute(create_table_query)

# INSERT INFO
insert_data_query = """
    INSERT IGNORE INTO data_table (id, name, description, access_level) VALUES
    (%s, %s, %s, %s)
    """
dataTables = [(1, 'Basic data level 1','Todos tem acesso', 1),
              (2, 'Moderate data level 2','Apenas o ministro do meio ambiente e diretores tem acesso', 2),
              (3, 'Sensitive data level 3','Apenas o ministro do meio ambiente tem acesso', 3)]

mycursor.executemany(insert_data_query, dataTables)

mydb.commit()

os.makedirs("static", exist_ok=True)

@app.route("/")
def helloWorld():
  return "Hello, cross-origin-world!"


@app.route("/upload", methods=["POST"])
def upload_image():
  if "file" not in request.files:
    return jsonify({"error": "No file provided"}), 400

  file = request.files["file"]
  if file.filename == "":
    return jsonify({"error": "No selected file"}), 400

  # Save the file in the static folder
  file_path = os.path.join("static", file.filename)
  file.save(file_path)

  return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

def encode(imgToCheck):
    if imgToCheck is None:
      print("Erro: Imagem não encontrada.")
    else:
      # Verifica o tipo de imagem e suas propriedades
      print(f"Tipo da imagem: {type(imgToCheck)}")
      print(f"Dimensões da imagem: {imgToCheck.shape}")  # Isso vai imprimir as dimensões e canais da imagem
      print(f"Tipo de dado da imagem: {imgToCheck.dtype}")  # Isso vai mostrar o tipo de dado, deve ser 'uint8'

      # Verifica se está em 8 bits
      if imgToCheck.dtype == 'uint8':
        try:
          # Converte para RGB
          rgb_img = cv2.cvtColor(imgToCheck, cv2.COLOR_BGR2RGB)

          # Detecta as faces manualmente antes de tentar codificar
          face_locations = face_recognition.face_locations(rgb_img)

          if len(face_locations) > 0:
            print(f"Face(s) detectada(s) em {len(face_locations)} local(is).")
            # Tenta encontrar as codificações faciais
            imgToCheck_encoding = face_recognition.face_encodings(rgb_img, face_locations)

            # Verifica se encontrou alguma face
            if len(imgToCheck_encoding) > 0:
              imgToCheck_encoding = imgToCheck_encoding[0]
              print("Face encoding found!")
            else:
              print("Nenhuma codificação facial encontrada.")
          else:
            print("Nenhuma face detectada na imagem.")

        except Exception as e:
          print(f"Erro ao processar a imagem: {e}")
      else:
        print("Erro: A imagem não está no formato esperado (8-bit uint8).")
      return imgToCheck_encoding

user_directory = "./static"
user_image_filename = "minister_image"


def find_user_image(directory, filename):
  for ext in ['.jpg', '.jpeg', '.png']:  # Lista de extensões suportadas
    full_path = os.path.join(directory, filename + ext)
    if os.path.exists(full_path):
      return full_path  # Retorna a imagem se encontrada
  return None  # Retorna None se não encontrar a imagem

imgUser = cv2.imread(find_user_image(user_directory, user_image_filename))
imgUser_encoded = encode(imgUser)

# COMPARA COM TODAS AS IMAGENS NA BASE DE DADOS

# Diretório onde estão as imagens conhecidas
diretorio = "FerramentaDeIdentificacaoEautenticacaoBiometrica\\BDDeFaces\\FacesConhecidas"

# Inicializa a variável para verificar se o usuário foi encontrado
usuario_encontrado = False
nivel_acesso = None

# Itera sobre os arquivos no diretório de Faces Conhecidas
for filename in os.listdir(diretorio):
    if filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png"):
        # Caminho completo do arquivo
        filepath = os.path.join(diretorio, filename)
        imgDB = cv2.imread(filepath)
        imgDB_encoded = encode(imgDB)

        if imgDB_encoded is not None:
            # Compara as codificações faciais
            result = face_recognition.compare_faces([imgUser_encoded], imgDB_encoded)
            if result[0]:  # Se a primeira comparação for verdadeira
                usuario_encontrado = True
                # Mostra imagens para verificação visual
                cv2.imshow("ImgUserNew", imgUser)
                cv2.imshow("ImgUserDB", imgDB)
                break  # Para a comparação se o usuário foi encontrado

if not usuario_encontrado:
    print("Usuário não encontrado na base de dados.")
else:
## ------------------------------------------------------------------- ##
## ---------------- GIVES THE ACESS LEVEL TO THE USER ---------------- ##
## ------------------------------------------------------------------- ##
    print(f"Nome do arquivo encontrado: {filename}")

    # GIVES THE ACESS LEVEL TO THE USER
    if "MinistroDoMeioAmbiente" in filename:
        nivel_acesso = 3  # Ministro do Meio Ambiente
    elif filename.startswith("DiretorDiv") and filename[10:-4].isdigit():
        nivel_acesso = 2  # Diretores (DiretorDiv1, DiretorDiv2, etc.)
    elif filename.startswith("Emp") and filename[3:-4].isdigit():
        nivel_acesso = 1  # Empregados (Emp1, Emp2, etc.)
    else:
        print("Nenhum nível de acesso correspondente encontrado.")

    print(f"Usuário identificado como: {filename} com nível de acesso: {nivel_acesso}")

    ## -------------------------------------------------------------------##
    ## ----------------- PRINT CODE BASED ON USER LEVEL ----------------- ##
    ## -------------------------------------------------------------------##
    # RETRIVE DATA AS PER USER LEVEL
    retriveQuery = "SELECT id, name, description FROM data_table WHERE access_level <= %s"
    mycursor.execute(retriveQuery, (nivel_acesso,))

    # PRINT DATA
    rows = mycursor.fetchall()
    for row in rows:
        print(f"ID: {row[0]}, Name: {row[1]}, Description {row[2]}")

## -------------------------------------------------------------------##
## -------------------------- CLOSES STUFF -------------------------- ##
## -------------------------------------------------------------------##
    cv2.waitKey(0)
    cv2.destroyAllWindows()

mycursor.close()
mydb.close()

if __name__ == "__main__":
  app.run(port=5000)