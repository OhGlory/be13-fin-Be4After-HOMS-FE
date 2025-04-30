// 이 파일은 예시 파일입니다. 개발시 삭제 후 진행해 주세요

export type CreateUserDto = {
    email: string;
    password: string;
    nickname: string;
  }
  
  export type VerificationOtpDto = {
    email: string
    otp: string
  }
  
  export type SignInDto = {
    email: string
    password: string
  }
  
  export type SignInResponseDto = {
    accessToken: string
    refreshToken: string
  }