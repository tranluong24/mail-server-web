from passlib.hash import sha512_crypt

# Tạo mật khẩu được mã hóa (băm)
password_plain = "123"
hashed_password = sha512_crypt.hash(password_plain)

# Tạo câu lệnh INSERT
for i in range(1, 51):  # từ 1 đến 50
    for suffix in ['a', 'b', 'c']:
        username = f"student{i:03}{suffix}"  # zero padding: 001, 002,...
        email = f"{username}@email.tekmonk.edu.vn"
        maildir = f"email.tekmonk.edu.vn/{username}/"
        print(f"INSERT INTO virtual_users (email, password, maildir) VALUES ('{email}', '{hashed_password}', '{maildir}');")
