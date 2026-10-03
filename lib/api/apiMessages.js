// Arabic translations of the messages the API returns (it only answers in
// English). Applied in client.js when the site language is Arabic; unknown
// messages are shown as sent.

const EXACT = {
  // auth & session
  'Incorrect email or password': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'You are not login, Please login to get access this route': 'يجب تسجيل الدخول للوصول إلى هذه الصفحة',
  'Invalid token, please login again..': 'جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى',
  'Expired token, please login again..': 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى',
  'the user that belong to this token does no longer exist': 'هذا الحساب لم يعد موجوداً',
  'User recently changed his password. please login again..': 'تم تغيير كلمة المرور مؤخراً، يرجى تسجيل الدخول مرة أخرى',
  'This account is deactivated, please login again to activate it': 'هذا الحساب معطّل، سجّل الدخول مرة أخرى لتفعيله',
  'are you not allowed to access this route': 'ليس لديك صلاحية لتنفيذ هذا الإجراء',
  'Your are not allowed to perform this action': 'ليس لديك صلاحية لتنفيذ هذا الإجراء',
  'Reset code invalid or expired': 'رمز الاستعادة غير صحيح أو منتهي الصلاحية',
  'Reset code not verified': 'لم يتم التحقق من رمز الاستعادة',
  'Reset code sent to email': 'تم إرسال رمز الاستعادة إلى بريدك الإلكتروني',
  'There is an error in sending email': 'حدث خطأ أثناء إرسال البريد الإلكتروني، حاول لاحقاً',

  // users & validation
  'User required': 'الاسم مطلوب',
  'Too short User name': 'الاسم قصير جداً',
  'Email required': 'البريد الإلكتروني مطلوب',
  'Invalid email address': 'البريد الإلكتروني غير صحيح',
  'E-mail already in use': 'البريد الإلكتروني مستخدم بالفعل',
  'E-mail already in user': 'البريد الإلكتروني مستخدم بالفعل',
  'Password required': 'كلمة المرور مطلوبة',
  'Password must be at least 6 characters': 'يجب ألا تقل كلمة المرور عن 6 أحرف',
  'Password confirmation required': 'تأكيد كلمة المرور مطلوب',
  'Password Confirmation incorrect': 'تأكيد كلمة المرور غير مطابق',
  'Incorrect current password': 'كلمة المرور الحالية غير صحيحة',
  'You must enter new password': 'أدخل كلمة المرور الجديدة',
  'You must enter the password confirm': 'أدخل تأكيد كلمة المرور',
  'You must enter your current password': 'أدخل كلمة المرور الحالية',
  'Too short password': 'كلمة المرور قصيرة جداً',
  'There is no user for this id': 'المستخدم غير موجود',
  'Invalid phone number only accepted UAE, Egy and SA Phone numbers':
    'رقم الجوال غير صحيح — يُقبل فقط رقم إماراتي أو مصري أو سعودي',
  'Invalid phone number': 'رقم الجوال غير صحيح',
  'Invalid role': 'الدور غير صحيح',

  // catalog
  'Category required': 'اسم القسم مطلوب',
  'Too short category name': 'اسم القسم قصير جداً',
  'Too long category name': 'اسم القسم طويل جداً',
  'SubCategory required': 'اسم القسم الفرعي مطلوب',
  'Too short SubCategory name': 'اسم القسم الفرعي قصير جداً',
  'Too long SubCategory name': 'اسم القسم الفرعي طويل جداً',
  'To short SubCategory name': 'اسم القسم الفرعي قصير جداً',
  'To long SubCategory name': 'اسم القسم الفرعي طويل جداً',
  'subCategory must be belong to category': 'يجب أن يتبع القسم الفرعي قسماً رئيسياً',
  'SubCategory must be belong to parent category': 'يجب أن يتبع القسم الفرعي قسماً رئيسياً',
  'subcategories not belong to category': 'الأقسام الفرعية المختارة لا تتبع هذا القسم',
  'Invalid subcategories Ids': 'أقسام فرعية غير صحيحة',
  'subcategories should be array of ids': 'أقسام فرعية غير صحيحة',
  'Invalid category id format': 'معرّف القسم غير صحيح',
  'Brand required': 'اسم العلامة التجارية مطلوب',
  'Too short brand name': 'اسم العلامة التجارية قصير جداً',
  'Too long brand name': 'اسم العلامة التجارية طويل جداً',
  'Product required': 'عنوان المنتج مطلوب',
  'must be at least 3 chars': 'يجب ألا يقل عن 3 أحرف',
  'Too short product title': 'عنوان المنتج قصير جداً',
  'Too long product title': 'عنوان المنتج طويل جداً',
  'Product description is required': 'وصف المنتج مطلوب',
  'Too short product description': 'وصف المنتج قصير جداً',
  'Too long description': 'الوصف طويل جداً',
  'Product quantity is required': 'الكمية مطلوبة',
  'Product quantity must be a positive number': 'يجب أن تكون الكمية رقماً موجباً',
  'Product price is required': 'السعر مطلوب',
  'Product price must be a number': 'يجب أن يكون السعر رقماً',
  'Too long product price': 'السعر أكبر من المسموح',
  'Product priceAfterDiscount must be a number': 'يجب أن يكون السعر بعد الخصم رقماً',
  'priceAfterDiscount must be lower than price': 'يجب أن يكون السعر بعد الخصم أقل من السعر',
  'Product imageCover is required': 'صورة الغلاف مطلوبة',
  'Product Image cover is required': 'صورة الغلاف مطلوبة',
  'Product must be belong to a category': 'يجب اختيار قسم للمنتج',
  'Product must be belong to category': 'يجب اختيار قسم للمنتج',
  'colors should be array of string': 'قائمة الألوان غير صحيحة',
  'images should be array of string': 'قائمة الصور غير صحيحة',
  'Invalid ID formate': 'معرّف غير صحيح',
  'only images allowed': 'يُسمح برفع الصور فقط',
  'This product is out of stock': 'نفدت كمية هذا المنتج',

  // reviews
  'ratings value required': 'التقييم مطلوب',
  'Ratings value must be between 1 to 5': 'يجب أن يكون التقييم بين 1 و 5',
  'Min ratings value is 1.0': 'أقل تقييم هو 1',
  'Max ratings value is 5.0': 'أعلى تقييم هو 5',
  'Rating must be between 0 and 5': 'يجب أن يكون التقييم بين 0 و 5',
  'You already created a review before': 'لقد قيّمت هذا المنتج من قبل',
  'Invalid Review id format': 'معرّف التقييم غير صحيح',

  // coupons, cart & orders
  'Coupon name required': 'كود الكوبون مطلوب',
  'Coupon expire time required': 'تاريخ انتهاء الكوبون مطلوب',
  'Coupon discount value required': 'قيمة الخصم مطلوبة',
  'Invalid expire date': 'تاريخ الانتهاء غير صحيح',
  'Discount must be between 1 and 100': 'يجب أن يكون الخصم بين 1 و 100',
  'Coupon is invalid or expired': 'الكوبون غير صحيح أو منتهي الصلاحية',
  'Your cart is empty': 'سلتك فارغة',
  'Quantity must be a whole number greater than 0': 'يجب أن تكون الكمية عدداً صحيحاً أكبر من 0',
  'Some items in your cart are no longer available in this quantity':
    'بعض المنتجات في سلتك لم تعد متوفرة بهذه الكمية',
  'Shipping address (details, phone, city) is required': 'عنوان الشحن (العنوان والجوال والمدينة) مطلوب',
  'Card payments are not configured': 'الدفع بالبطاقة غير متاح حالياً، يرجى اختيار الدفع عند الاستلام',

  // generic
  'no document for this id': 'العنصر غير موجود',
  'Network error — please check your connection.': 'خطأ في الاتصال — تحقق من اتصالك بالإنترنت.',
  'Something went wrong': 'حدث خطأ ما',
  'Internal server error': 'حدث خطأ في الخادم، حاول لاحقاً',
};

// messages that contain values (ids, quantities…)
const PATTERNS = [
  [/^Only (\d+) items available in stock$/, (m) => `متوفر ${m[1]} قطعة فقط في المخزون`],
  [/^There is no product with id /, () => 'المنتج غير موجود'],
  [/^There is no review with id /, () => 'التقييم غير موجود'],
  [/^There is no such a order with this id/, () => 'الطلب غير موجود'],
  [/^There is no such cart with id /, () => 'السلة غير موجودة'],
  [/^there is no cart for user /, () => 'السلة غير موجودة'],
  [/^there is no item for this id/, () => 'المنتج غير موجود في السلة'],
  [/^There is no user with (that )?email /, () => 'لا يوجد حساب بهذا البريد الإلكتروني'],
  [/^no document for this /, () => 'العنصر غير موجود'],
  [/^This (\w+) already exists$/, () => 'هذه القيمة مستخدمة بالفعل'],
  [/^Invalid (\w+): /, () => 'قيمة غير صحيحة'],
  [/^can't find this route /, () => 'الصفحة المطلوبة غير موجودة'],
];

export function translateApiMessage(message, locale) {
  if (locale !== 'ar' || typeof message !== 'string') return message;
  const key = message.trim();
  if (EXACT[key]) return EXACT[key];
  for (const [pattern, toArabic] of PATTERNS) {
    const match = key.match(pattern);
    if (match) return toArabic(match);
  }
  return message;
}

/** Current UI language (the LocaleProvider keeps <html lang> in sync). */
export const currentLocale = () =>
  typeof document !== 'undefined' ? document.documentElement.lang : 'en';
