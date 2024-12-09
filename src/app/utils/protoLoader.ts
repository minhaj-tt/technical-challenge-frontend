import protobuf from "protobufjs";

const loadProto = async () => {
  const root = await protobuf.load("./proto/login.proto");
  const LoginRequest = root.lookupType("auth.LoginRequest");
  const LoginResponse = root.lookupType("auth.LoginResponse");

  return { LoginRequest, LoginResponse };
};

export default loadProto;
