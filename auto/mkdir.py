for i in range(3, 51):  # từ student003 đến student050
    for suffix in ['a', 'b', 'c']:
        username = f"student{i:03}{suffix}"
        base_path = f"/var/mail/vhosts/email.tekmonk.edu.vn/{username}"
        
        # Tạo lệnh
        print(f"mkdir -p {base_path}/{{cur,new,tmp}}")
        print(f"chown -R vmail:vmail {base_path}")
        print(f"chmod -R 700 {base_path}")
