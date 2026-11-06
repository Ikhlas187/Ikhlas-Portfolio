"""Base de démonstration de MediPass : même schéma que l'originale, personnes fictives (aucune donnée réelle publiée).

Usage : python make_demo_db.py <base_source.db> <base_demo.db>
"""
import hashlib
import shutil
import sqlite3
import sys

source, target = sys.argv[1], sys.argv[2]
shutil.copyfile(source, target)
db = sqlite3.connect(target)
for table in ['habilitations', 'Examen', 'Antecedent', 'Consultation', 'DossierMedical', 'Patient',
              'ProfessionnelDeSante', 'Administrateur', 'Utilisateur', 'sqlite_sequence']:
    db.execute(f'DELETE FROM "{table}"')


def sha(text):
    return hashlib.sha256(text.encode()).hexdigest()


PASSWORD = sha('demo1234')
users = [
    ('US001', 'MARTIN', 'Claire', '00000001', 'F', 'admin', PASSWORD, 1),
    ('US002', 'DUPONT', 'Hugo', '00000002', 'M', 'docteur', PASSWORD, 0),
    ('US003', 'BERNARD', 'Lea', '00000003', 'F', 'infirmiere', PASSWORD, 0),
]
db.executemany('INSERT INTO Utilisateur VALUES (?,?,?,?,?,?,?,?)', users)
db.execute("INSERT INTO Administrateur VALUES ('US001','US001')")
db.executemany('INSERT INTO ProfessionnelDeSante VALUES (?,?,?,?,?)', [
    ('US002', 'US002', 'Medecine generale', 1, 0),
    ('US003', 'US003', 'Soins infirmiers', 1, 0),
])
patients = [
    ('PA0001', 'LEROY', 'Nina', '1995-04-12', 'F', '00000010'),
    ('PA0002', 'MOREAU', 'Lucas', '1988-09-30', 'M', '00000011'),
    ('PA0003', 'GIRARD', 'Ines', '2001-01-22', 'F', '00000012'),
]
db.executemany('INSERT INTO Patient VALUES (?,?,?,?,?,?)', patients)
db.executemany('INSERT INTO DossierMedical (id_patient, poids, taille) VALUES (?,?,?)', [
    ('PA0001', 58, 165), ('PA0002', 76, 180), ('PA0003', 62, 170),
])
db.executemany(
    'INSERT INTO Consultation (id_dossier_medical, id_professionnel, date_debut, date_fin, motif, diagnostic, statut) VALUES (?,?,?,?,?,?,?)', [
        (1, 'US002', '2026-11-10 09:00', '2026-11-10 09:30', 'Controle annuel', None, 0),
        (2, 'US002', '2026-11-12 14:00', '2026-11-12 14:30', 'Douleurs dorsales', None, 0),
    ])
db.execute("INSERT INTO habilitations VALUES ('US002','US003','PA0001','Suivi des soins')")
db.commit()
db.execute('VACUUM')
db.close()
print('ok', target)
