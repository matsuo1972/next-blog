'use server';
import { registerSchema } from "@/validations/user";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

type ActionState = {
    success: boolean,
    errors: Record<string, string[]>
}
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
// バリデーションエラー処理
function handleValidationError(error: ZodError): ActionState {
    console.log('error', error);
    const { fieldErrors, formErrors } = error.flatten();
    // undefiendを除去
    const castFieldErrors = fieldErrors as Record<string, string[]>;
    // zodの仕様でパスワード一致確認のエラーは formErrorsで渡ってくる
    // formErrorsがある場合は、confirmPasswordフィールドにエラーを追加
    if (formErrors.length > 0) {
        return { success: false, errors: { ...fieldErrors, confirmPassword: formErrors}}
    }
    return { success: false, errors: castFieldErrors };
}
// カスタムエラー処理
function handleError(customErrors: Record<string, string[]>): ActionState {
    return { success: false, errors: customErrors };
} 

export async function createUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
    // フォームから渡ってきた情報を取得します
    const rawFormData = Object.fromEntries(["name", "email", "password", "confirmPassword"].map((key) => [key, formData.get(key) as string])) as Record<string, string>;
    console.log('rawFormData', rawFormData);
    // ヴァリデーションを行います
    const validationResult = registerSchema.safeParse(rawFormData);
    console.log('validationResult', validationResult);
    if (!validationResult.success) {
        console.log('validationResult.error', validationResult.error);
        return handleValidationError(validationResult.error);
    }

    // DBにユーザーが存在するか確認します
    const existingUser = await prisma.user.findUnique({ where: { email: rawFormData.email }});
    console.log('existingUser', existingUser);
    if (existingUser) {
        return handleError({ email: ["このメールアドレスは既に登録されています"] });
    }

    // 存在していなければDBにユーザーを作成します
    const hashedPassword = await bcryptjs.hash(rawFormData.password, 12);

    await prisma.user.create({
        data: {
            name: rawFormData.name,
            email: rawFormData.email,
            password: hashedPassword,
        }
    });
    
    // 存在していればdashboardにリダイレクトします
    await signIn('credentials', { 
        ...Object.fromEntries(formData), // オブジェクトに変換
        redirect: false }); // 自動リダイレクトを無効にする
    redirect('/dashboard'); // 認証成功後に手動でダッシュボードにリダイレクト
}