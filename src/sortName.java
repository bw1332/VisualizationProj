import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.*;

/**
 * Created by bowang on 12/3/16.
 */
public class sortName {
    public static void main(String[] args) throws IOException, JSONException {
        File file = new File("#50#1999");
        Scanner scanner = new Scanner(new FileInputStream(file));
        Set<String> set = new HashSet<>();
        while(scanner.hasNextLine()) {
            JSONObject object = new JSONObject(scanner.nextLine());
            set.add(object.get("from").toString());
            JSONArray arr = object.getJSONArray("to");
            for (int i = 0; i < arr.length(); i++) {
                set.add(arr.get(i).toString());
            }
        }
        System.out.println(set.size());
        List<String> list = new ArrayList<>(set);
        Collections.sort(list);
        File emails = new File("emails");
        FileWriter writer = new FileWriter(emails);
        for (String string : list) {
            writer.append(string + "\n");
        }
        writer.close();
    }
}
