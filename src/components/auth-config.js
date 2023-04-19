import { I18n } from "aws-amplify";
import { 
  Flex, 
  Heading,
  Text,
  useTheme, 
  View, 
} from '@aws-amplify/ui-react';

export const authComponents = {
  Header: () => {
    const { tokens } = useTheme();
    return <Flex justifyContent="center" padding={tokens.space.xl}></Flex>
  },
  SignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading level={4} padding={`${tokens.space.xl} ${tokens.space.xl} 0`} >
          Sign in
        </Heading>
      )
    }
  },
  Footer() {    
    const { tokens } = useTheme();
    return (
      <View textAlign="center">
        <Flex justifyContent="center" padding={tokens.space.medium}>
          <Text>
            初回ログインは管理者にご連絡ください。
          </Text>
        </Flex>
      </View>
    );
  },
};

export const setVocabularies = () => {
  I18n.setLanguage('ja');
  I18n.putVocabulariesForLanguage('ja', {
    'Account recovery requires verified contact information': '追加認証が必要です',
    Code: '認証コード',
    "Code *": '認証コード',
    'Back to Sign In': '戻る',
    'Change Password': 'パスワードを変更',
    Changing: '変更中',
    'Confirm Password': 'パスワード再入力',
    Email: 'メールアドレス',
    'Enter your email': 'メールアドレス',
    'Forgot password?': 'パスワードをリセット',
    'Forgot your password?': 'パスワードをリセット',
    'Incorrect username or password.': 'ユーザ名またはパスワードが違います。',
    // 'Invalid password format': 'パスワードのフォーマットが不正です。',
    'Invalid verification code provided, please try again.': '指定された確認コードが無効です。もう一度お試しください。',
    'New Password': 'パスワード',
    Password: 'パスワード',
    'Password must have at least 8 characters': 'パスワードは8文字以上を入力してください。',
    'Resend Code': '認証コードを再送信',
    'Reset your password': 'パスワードをリセット',
    'Reset your Password': 'パスワードをリセット',
    'Send code': '認証コードを送信',
    'Send Code': '認証コードを送信',
    Sending: '送信中',
    Skip: 'スキップ',
    Submit: '送信',
    Submitting: '送信中',
    'User does not exist.': 'ユーザが存在しません。',
    Username: 'ユーザ名', 
    'Username/client id combination not found.': 'ユーザが存在しません',
    // 'User already exists': 'ユーザーは既に存在します。',
    // 'User is not confirmed.': 'ユーザは未検証状態です。',
    'User password cannot be reset in the current state.': 'パスワードリセットできません。管理者にお問い合わせください。',
    Verify: '認証メールを送信',
    'Verifying...': '送信中',
    'Your passwords must match': 'パスワードが一致しません。',

    'Invalid phone number format': '不正な電話番号フォーマットです。 電話番号は次のフォーマットで入力してください: +12345678900',
    'An account with the given email already exists.': 'そのメールアドレスは既に存在します',
    'Username cannot be empty': 'ユーザ名は必須です',
    'Password attempts exceeded': 'ログイン試行回数が上限に達しました',
    'Attempt limit exceeded, please try after some time.': '試行制限を超過しました。しばらくしてからもう一度お試しください',
    'CUSTOM_AUTH is not enabled for the client.': 'パスワードは必須です', 
    'Temporary password has expired and must be reset by an administrator.': '一時パスワードは無効です。管理者によるリセットが必要です',
    "1 validation error detected: Value null at 'attributeName' failed to satisfy constraint: Member must not be null": '入力チェックエラー、必須項目がNULLです', //アカウント復旧でのメールアドレスのラジオをチェックONにせず、送信した場合
    'Invalid session for the user, session is expired.' : 'セッションが有効期限切れです。ログインし直してください。' // ログインセッション無効です、ログインからやり直し
  });
};
