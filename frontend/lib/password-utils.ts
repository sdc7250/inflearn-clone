import bcrypt from "bcryptjs";

// salt + hash
export function saltAndHashPassword(password: string): string {
  const saltrounds = 10;
  const salt = bcrypt.genSaltSync(saltrounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}
// 비밀번호 매칭
export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}