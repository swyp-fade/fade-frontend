import { FadeLogo } from '@Components/FadeLogo';

export function InitializeAccountView() {
  return (
    <section>
      <header className="border-b border-b-gray-200 px-5 py-4">
        <FadeLogo />
      </header>

      <section className="p-5">
        <form>
          <fieldset>
            <fieldset>
              <input className="w-full appearance-none rounded-lg border border-gray-200 px-5 py-[.875rem] outline-none focus:border-purple-500" placeholder="계정 ID" />
              <div className="mt-2 pl-2 text-xs text-gray-600">
                <p>사용할 계정 ID를 입력해주세요.</p>
                <ul className="list-disc pl-5">
                  <li>영문자, 숫자, 마침표 및 밑줄만 사용 가능</li>
                  <li>최소 4자, 최대 30자</li>
                </ul>
              </div>
            </fieldset>

            <fieldset>
              <button>남자</button>
              <button>여자</button>
            </fieldset>
          </fieldset>
        </form>
      </section>
    </section>
  );
}
