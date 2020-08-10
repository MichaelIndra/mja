import * as jwt from 'jsonwebtoken';

export function getBranchId(authorization: any) {
  if (!authorization) return null;
  let token;
  const exp = authorization.split(' ');
  if (exp && exp.length > 0) {
    token = exp[1];
  } else {
    return null;
  }

  const account: any = jwt.decode(token);
  return account.branch_id;
}

export async function getAccountId(authorization: any) {
  if (!authorization) return null;
  let token;
  const exp = await authorization.split(' ');
  if (exp && exp.length > 0) {
    token = exp[1];
  } else {
    return null;
  }

  const account: any = await jwt.decode(token);
  return account.id;
}

export async function getUserRole(authorization: any) {
  if (!authorization) return null;
  let token;
  const exp = await authorization.split(' ');
  if (exp && exp.length > 0) {
    token = exp[1];
  } else {
    return null;
  }

  const account: any = await jwt.decode(token);
  return account.roles[0];
}
