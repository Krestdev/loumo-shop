// types/google.d.ts
export {}

declare global {
  interface Window {
    google?: typeof google
  }

  namespace google {
    namespace accounts.id {
      interface CredentialResponse {
        credential: string
        select_by: string
        clientId: string
      }

      interface IdConfiguration {
        client_id: string
        callback: (response: CredentialResponse) => void
        auto_select?: boolean
        login_uri?: string
        native_callback?: () => void // Changé de Function à () => void
        cancel_on_tap_outside?: boolean
        prompt_parent_id?: string
        nonce?: string
        context?: string
        state_cookie_domain?: string
        ux_mode?: "popup" | "redirect"
        allowed_parent_origin?: string | string[]
        intermediate_iframe_close_callback?: () => void
      }

      function initialize(config: IdConfiguration): void

      function renderButton(
        parent: HTMLElement,
        options: {
          type?: string
          theme?: "outline" | "filled_blue" | "filled_black"
          size?: "small" | "medium" | "large"
          text?: "signin_with" | "signup_with" | "continue_with" | "sign_in_with"
          shape?: "rectangular" | "pill" | "circle" | "square"
          logo_alignment?: "left" | "center"
          width?: number
          locale?: string
        }
      ): void

      function prompt(callback?: (notification: PromptMomentNotification) => void): void

      interface PromptMomentNotification {
        isDisplayMoment(): boolean
        isDisplayed(): boolean
        isNotDisplayed(): boolean
        getNotDisplayedReason(): string
        isSkippedMoment(): boolean
        getSkippedReason(): string
        isDismissedMoment(): boolean
        getDismissedReason(): string
      }
    }
  }
}